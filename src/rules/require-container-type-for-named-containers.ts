/**
 * @packageDocumentation
 * Rule requiring useful container-type declarations for queried named
 * containers.
 */
import type { Root } from "postcss";

import stylelint, { type PostcssResult } from "stylelint";
import { isDefined, isEmpty, setHas } from "ts-extras";

import { collectContainerTypesByName } from "../_internal/container-declaration-analysis.js";
import {
    collectSizeQueryFeatureNames,
    conditionContainsQueryFunction,
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

const ruleName = createRuleName("require-container-type-for-named-containers");

type RequireContainerTypeForNamedContainersSecondaryOptions = Readonly<{
    ignoreNames?: readonly string[];
}>;

const missingContainerTypeMessage = (containerName: string): string =>
    `Container query "${containerName}" targets a named container declared without container-type. Add container-type or use the container shorthand so size/scroll-state query behavior is explicit.`;

const messages = stylelint.utils.ruleMessages(ruleName, {
    missingContainerType: missingContainerTypeMessage,
});

const docs = {
    description:
        "Require named containers used by size or scroll-state queries to declare an explicit container-type.",
    recommended: false,
    url: createRuleDocsUrl("require-container-type-for-named-containers"),
} as const;

const rule =
    (
        primary: boolean,
        secondaryOptions: RequireContainerTypeForNamedContainersSecondaryOptions = {}
    ) =>
    (root: Root, result: PostcssResult) => {
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
            const usesTypeDependentQuery =
                !isEmpty(collectSizeQueryFeatureNames(parsed.condition)) ||
                conditionContainsQueryFunction(
                    parsed.condition,
                    "scroll-state"
                );

            if (
                usesTypeDependentQuery &&
                isDefined(summary) &&
                !summary.hasTypeDeclaration
            ) {
                report({
                    message: messages.missingContainerType(containerName),
                    node: atRule,
                    result,
                    ruleName,
                });
            }
        });
    };

/** Require explicit container-type for queried named containers. */
const requireContainerTypeForNamedContainersRule: StylelintPluginRuleContract =
    createStylelintRule({
        docs,
        messages,
        meta: {
            url: docs.url,
        },
        rule,
        ruleName,
    });

export default requireContainerTypeForNamedContainersRule;
