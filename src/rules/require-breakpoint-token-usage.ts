/**
 * @packageDocumentation
 * Rule enforcing breakpoint token usage in @container queries.
 */
import stylelint from "stylelint";
import { setHas } from "ts-extras";

import {
    extractLengthLiterals,
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

const ruleName = createRuleName("require-breakpoint-token-usage");

type BreakpointTokenRuleSecondaryOptions = Readonly<{
    allowedUnits?: readonly string[];
}>;

const defaultAllowedUnits = [
    "cqi",
    "cqb",
    "cqw",
    "cqh",
    "cqmin",
    "cqmax",
];

const hardcodedLiteralMessage = (literal: string): string =>
    `Avoid hardcoded breakpoint literal "${literal}" in @container queries. Use a design token such as var(--cq-*) instead.`;

const messages = stylelint.utils.ruleMessages(ruleName, {
    hardcodedLiteral: hardcodedLiteralMessage,
});

const docs = {
    description:
        "Require container breakpoints to come from tokenized values instead of hardcoded length literals.",
    recommended: false,
    url: createRuleDocsUrl("require-breakpoint-token-usage"),
} as const;

const rule =
    (
        primary: boolean,
        secondaryOptions: BreakpointTokenRuleSecondaryOptions = {}
    ) =>
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

        const allowedUnits = new Set(
            normalizeAllowedUnits(
                secondaryOptions.allowedUnits,
                defaultAllowedUnits
            ).map((unit) => unit.toLowerCase())
        );

        root.walkAtRules("container", (atRule) => {
            const { condition } = parseContainerQueryParams(atRule.params);

            if (condition.includes("var(")) {
                return;
            }

            for (const literal of extractLengthLiterals(condition)) {
                const unit = literal
                    .replace(/^-?(?:\d+\.\d+|\d+|\.\d+)/v, "")
                    .toLowerCase();

                if (!setHas(allowedUnits, unit)) {
                    report({
                        message: messages.hardcodedLiteral(literal),
                        node: atRule,
                        result,
                        ruleName,
                    });
                }
            }
        });
    };

const requireBreakpointTokenUsageRule: StylelintPluginRuleContract =
    createStylelintRule({
        docs,
        messages,
        meta: {
            url: docs.url,
        },
        rule,
        ruleName,
    });

export default requireBreakpointTokenUsageRule;

function normalizeAllowedUnits(
    value: unknown,
    fallback: readonly string[]
): readonly string[] {
    if (!Array.isArray(value)) {
        return fallback;
    }

    const normalized: string[] = [];

    for (const item of value) {
        if (typeof item === "string") {
            const trimmed = item.trim();

            if (trimmed !== "") {
                normalized.push(trimmed);
            }
        }
    }

    return normalized.length > 0 ? normalized : fallback;
}
