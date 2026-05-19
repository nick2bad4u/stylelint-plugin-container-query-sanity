/**
 * @packageDocumentation
 * Rule detecting container query bounds that cannot filter any real size.
 */
import type { Root } from "postcss";

import stylelint, { type PostcssResult } from "stylelint";
import { isDefined, setHas } from "ts-extras";

import {
    collectFeatureConstraints,
    type ContainerSizeFeature,
    parseContainerQueryParams,
} from "../_internal/container-query-analysis.js";
import {
    createStylelintRule,
    type StylelintPluginRuleContract,
} from "../_internal/create-stylelint-rule.js";
import {
    createRuleDocsUrl,
    createRuleName,
} from "../_internal/plugin-constants.js";

const { report, validateOptions } = stylelint.utils;

const ruleName = createRuleName("no-degenerate-container-query-conditions");

const degenerateLowerBoundMessage = (feature: string, bound: string): string =>
    `Container query lower bound "${feature} ${bound}" cannot filter any non-negative container size. Remove the redundant condition or replace it with a meaningful breakpoint.`;

const messages = stylelint.utils.ruleMessages(ruleName, {
    degenerateLowerBound: degenerateLowerBoundMessage,
});

const docs = {
    description:
        "Disallow redundant lower bounds that are always true for non-negative container sizes.",
    recommended: false,
    url: createRuleDocsUrl("no-degenerate-container-query-conditions"),
} as const;

const rule =
    (primary: boolean) =>
    (root: Readonly<Root>, result: Readonly<PostcssResult>) => {
        const validOptions = validateOptions(result, ruleName, {
            actual: primary,
            possible: [true],
        });

        if (!validOptions) {
            return;
        }

        root.walkAtRules("container", (atRule) => {
            const { condition } = parseContainerQueryParams(atRule.params);
            const reportedFeatures = new Set<ContainerSizeFeature>();

            for (const constraint of collectFeatureConstraints(condition)) {
                const lower = constraint.interval.lower;

                if (
                    isDefined(lower) &&
                    !setHas(reportedFeatures, constraint.feature) &&
                    (lower.value < 0 || (lower.value === 0 && lower.inclusive))
                ) {
                    reportedFeatures.add(constraint.feature);

                    report({
                        message: messages.degenerateLowerBound(
                            constraint.feature,
                            `${lower.inclusive ? ">=" : ">"} ${String(
                                lower.value
                            )}${lower.unit}`
                        ),
                        node: atRule,
                        result,
                        ruleName,
                    });
                }
            }
        });
    };

/** Detect redundant lower bounds in container size conditions. */
const noDegenerateContainerQueryConditionsRule: StylelintPluginRuleContract =
    createStylelintRule({
        docs,
        messages,
        meta: {
            url: docs.url,
        },
        rule,
        ruleName,
    });

export default noDegenerateContainerQueryConditionsRule;
