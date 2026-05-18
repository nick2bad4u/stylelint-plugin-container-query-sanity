/**
 * @packageDocumentation
 * Rule preferring logical size features in container queries.
 */
import stylelint from "stylelint";
import { arrayJoin, isEmpty, setHas } from "ts-extras";

import {
    collectSizeQueryFeatureNames,
    type ContainerQueryFeatureName,
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

const ruleName = createRuleName("prefer-logical-size-features");

const physicalFeatureMessage = (features: string): string =>
    `Container query uses physical size feature(s) ${features}. Prefer inline-size/block-size so component breakpoints follow writing mode.`;

const messages = stylelint.utils.ruleMessages(ruleName, {
    physicalFeature: physicalFeatureMessage,
});

const docs = {
    description:
        "Prefer logical inline-size/block-size features over physical width/height in container queries.",
    recommended: false,
    url: createRuleDocsUrl("prefer-logical-size-features"),
} as const;

const physicalFeatures = new Set<ContainerQueryFeatureName>([
    "height",
    "width",
]);

const rule =
    (primary: boolean) =>
    (
        root: import("postcss").Root,
        result: import("stylelint").PostcssResult
    ) => {
        const validOptions = validateOptions(result, ruleName, {
            actual: primary,
            possible: [true],
        });

        if (!validOptions) {
            return;
        }

        root.walkAtRules("container", (atRule) => {
            const { condition } = parseContainerQueryParams(atRule.params);
            const physicalFeatureNames = collectSizeQueryFeatureNames(
                condition
            ).filter((featureName) => setHas(physicalFeatures, featureName));

            if (!isEmpty(physicalFeatureNames)) {
                report({
                    message: messages.physicalFeature(
                        arrayJoin(physicalFeatureNames, ", ")
                    ),
                    node: atRule,
                    result,
                    ruleName,
                });
            }
        });
    };

/** Prefer logical size feature names in container queries. */
const preferLogicalSizeFeaturesRule: StylelintPluginRuleContract =
    createStylelintRule({
        docs,
        messages,
        meta: {
            url: docs.url,
        },
        rule,
        ruleName,
    });

export default preferLogicalSizeFeaturesRule;
