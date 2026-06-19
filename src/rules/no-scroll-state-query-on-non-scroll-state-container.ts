/**
 * @packageDocumentation
 * Rule preventing scroll-state queries against containers without scroll-state
 * containment.
 */
import type { Root } from "postcss";

import stylelint, { type PostcssResult } from "stylelint";
import { isDefined, setHas } from "ts-extras";

import { collectContainerTypesByName } from "../_internal/container-declaration-analysis.js";
import {
    hasQueryFunctionCondition,
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

const ruleName = createRuleName(
    "no-scroll-state-query-on-non-scroll-state-container"
);

type NoScrollStateQueryOnNonScrollStateContainerSecondaryOptions = Readonly<{
    ignoreNames?: readonly string[];
    whenTypeUnknown?: "ignore" | "report";
}>;

const missingTypeDeclarationMessage = (containerName: string): string =>
    `Container query "${containerName}" uses scroll-state(), but no static container-type declaration for that name was found in this stylesheet. Declare container-type: scroll-state or include scroll-state in the container shorthand.`;

const nonScrollStateTypeMessage = (containerName: string): string =>
    `Container query "${containerName}" uses scroll-state(), but the matching container is not declared with scroll-state containment. Add container-type: scroll-state or remove the scroll-state query.`;

const unknownTypeMessage = (containerName: string): string =>
    `Container query "${containerName}" uses scroll-state(), but this stylesheet only has dynamic or unrecognized container-type declarations for that name. Use an explicit container-type including scroll-state.`;

const messages = stylelint.utils.ruleMessages(ruleName, {
    missingTypeDeclaration: missingTypeDeclarationMessage,
    nonScrollStateType: nonScrollStateTypeMessage,
    unknownType: unknownTypeMessage,
});

const docs = {
    description:
        "Disallow scroll-state() queries that target names not declared with scroll-state containment.",
    recommended: false,
    url: createRuleDocsUrl(
        "no-scroll-state-query-on-non-scroll-state-container"
    ),
} as const;

const rule =
    (
        primary: boolean,
        secondaryOptions: NoScrollStateQueryOnNonScrollStateContainerSecondaryOptions = {}
    ) =>
    (root: Readonly<Root>, result: Readonly<PostcssResult>) => {
        const isValidOptions = validateOptions(result, ruleName, {
            actual: primary,
            possible: [true],
        });

        if (!isValidOptions) {
            return;
        }

        const ignoredNames = new Set(
            (secondaryOptions.ignoreNames ?? []).map((name) => name.trim())
        );
        const whenTypeUnknown =
            secondaryOptions.whenTypeUnknown === "report" ? "report" : "ignore";
        const summaryByName = collectContainerTypesByName(root);

        root.walkAtRules("container", (atRule) => {
            const parsed = parseContainerQueryParams(atRule.params);
            const containerName = parsed.containerName;

            if (!hasQueryFunctionCondition(parsed.condition, "scroll-state")) {
                return;
            }

            if (
                !isDefined(containerName) ||
                setHas(ignoredNames, containerName)
            ) {
                return;
            }

            const summary = summaryByName.get(containerName);

            if (!isDefined(summary)) {
                if (whenTypeUnknown === "report") {
                    report({
                        message: messages.missingTypeDeclaration(containerName),
                        node: atRule,
                        result,
                        ruleName,
                    });
                }

                return;
            }

            if (!summary.hasTypeDeclaration) {
                if (whenTypeUnknown === "report") {
                    report({
                        message: messages.missingTypeDeclaration(containerName),
                        node: atRule,
                        result,
                        ruleName,
                    });
                }

                return;
            }

            if (summary.hasScrollState) {
                return;
            }

            report({
                message: summary.hasUnknown
                    ? messages.unknownType(containerName)
                    : messages.nonScrollStateType(containerName),
                node: atRule,
                result,
                ruleName,
            });
        });
    };

/** Prevent scroll-state queries against non-scroll-state containers. */
const noScrollStateQueryOnNonScrollStateContainerRule: StylelintPluginRuleContract =
    createStylelintRule({
        docs,
        messages,
        meta: {
            url: docs.url,
        },
        rule,
        ruleName,
    });

export default noScrollStateQueryOnNonScrollStateContainerRule;
