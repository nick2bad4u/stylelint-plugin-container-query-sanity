/**
 * @packageDocumentation
 * Rule preventing block-axis queries against inline-size-only containers.
 */
import type { Root } from "postcss";

import stylelint, { type PostcssResult } from "stylelint";
import { arrayJoin, isDefined, isEmpty, setHas } from "ts-extras";

import { collectContainerTypesByName } from "../_internal/container-declaration-analysis.js";
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

const ruleName = createRuleName("no-block-axis-query-on-inline-size-container");

type NoBlockAxisQueryOnInlineSizeContainerSecondaryOptions = Readonly<{
    ignoreNames?: readonly string[];
}>;

const blockAxisFeatures = new Set<ContainerQueryFeatureName>([
    "aspect-ratio",
    "block-size",
    "height",
    "orientation",
]);

const blockAxisQueryMessage = (
    containerName: string,
    features: string
): string =>
    `Container query "${containerName}" uses block-axis feature(s) ${features}, but the matching container is only declared with inline-size containment. Use container-type: size or query inline-axis features only.`;

const messages = stylelint.utils.ruleMessages(ruleName, {
    blockAxisQuery: blockAxisQueryMessage,
});

const docs = {
    description:
        "Disallow block-axis size features in queries targeting inline-size-only containers.",
    recommended: false,
    url: createRuleDocsUrl("no-block-axis-query-on-inline-size-container"),
} as const;

const rule =
    (
        primary: boolean,
        secondaryOptions: NoBlockAxisQueryOnInlineSizeContainerSecondaryOptions = {}
    ) =>
    (root: Readonly<Root>, result: Readonly<PostcssResult>) => {
        const validOptions = validateOptions(result, ruleName, {
            actual: primary,
            possible: [true],
        });

        if (!validOptions) {
            return;
        }

        const ignoredNames = new Set(
            (secondaryOptions.ignoreNames ?? []).map((name) => name.trim())
        );
        const summaryByName = collectContainerTypesByName(root);

        root.walkAtRules("container", (atRule) => {
            const parsed = parseContainerQueryParams(atRule.params);
            const containerName = parsed.containerName;

            if (
                !isDefined(containerName) ||
                setHas(ignoredNames, containerName)
            ) {
                return;
            }

            const summary = summaryByName.get(containerName);

            if (
                !isDefined(summary) ||
                summary.hasBlockSizeContainment ||
                !summary.hasInlineSizeContainment
            ) {
                return;
            }

            const invalidFeatures = collectSizeQueryFeatureNames(
                parsed.condition
            ).filter((featureName) => setHas(blockAxisFeatures, featureName));

            if (isEmpty(invalidFeatures)) {
                return;
            }

            report({
                message: messages.blockAxisQuery(
                    containerName,
                    arrayJoin(invalidFeatures, ", ")
                ),
                node: atRule,
                result,
                ruleName,
            });
        });
    };

/** Prevent block-axis queries against inline-size-only containers. */
const noBlockAxisQueryOnInlineSizeContainerRule: StylelintPluginRuleContract =
    createStylelintRule({
        docs,
        messages,
        meta: {
            url: docs.url,
        },
        rule,
        ruleName,
    });

export default noBlockAxisQueryOnInlineSizeContainerRule;
