/**
 * @packageDocumentation
 * Rule preventing size queries from targeting containers without size containment.
 */
import type { Root } from "postcss";

import stylelint, { type PostcssResult } from "stylelint";
import { isDefined, isEmpty, setHas } from "ts-extras";

import { collectContainerTypesByName } from "../_internal/container-declaration-analysis.js";
import {
    collectFeatureConstraints,
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

const ruleName = createRuleName("no-size-query-on-non-size-container");

type NoSizeQueryOnNonSizeContainerSecondaryOptions = Readonly<{
    ignoreNames?: readonly string[];
    whenTypeUnknown?: "ignore" | "report";
}>;

const missingTypeDeclarationMessage = (containerName: string): string =>
    `Container query "${containerName}" uses size features but no static container-type declaration for that name was found in this stylesheet. Declare container-type: inline-size|size (or use container shorthand).`;

const nonSizeTypeMessage = (containerName: string): string =>
    `Container query "${containerName}" uses size features, but this stylesheet only declares non-size container-type values for that name. Use container-type: inline-size|size.`;

const unknownTypeMessage = (containerName: string): string =>
    `Container query "${containerName}" uses size features, but this stylesheet only has dynamic or unrecognized container-type declarations for that name. Use an explicit container-type: inline-size|size.`;

const messages = stylelint.utils.ruleMessages(ruleName, {
    missingTypeDeclaration: missingTypeDeclarationMessage,
    nonSizeType: nonSizeTypeMessage,
    unknownType: unknownTypeMessage,
});

const docs = {
    description:
        "Disallow size-feature @container queries that target names declared without size-capable container-type values.",
    recommended: false,
    url: createRuleDocsUrl("no-size-query-on-non-size-container"),
} as const;

const rule =
    (
        primary: boolean,
        secondaryOptions: NoSizeQueryOnNonSizeContainerSecondaryOptions = {}
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
            normalizeIgnoreNames(secondaryOptions.ignoreNames)
        );
        const whenTypeUnknown = normalizeWhenTypeUnknown(
            secondaryOptions.whenTypeUnknown
        );
        const summaryByName = collectContainerTypesByName(root);

        root.walkAtRules("container", (atRule) => {
            const parsed = parseContainerQueryParams(atRule.params);
            const containerName = parsed.containerName;

            if (!isDefined(containerName)) {
                return;
            }

            if (setHas(ignoredNames, containerName)) {
                return;
            }

            if (isEmpty(collectFeatureConstraints(parsed.condition))) {
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

            if (summary.hasInlineSizeContainment) {
                return;
            }

            report({
                message: summary.hasUnknown
                    ? messages.unknownType(containerName)
                    : messages.nonSizeType(containerName),
                node: atRule,
                result,
                ruleName,
            });
        });
    };

function normalizeIgnoreNames(values: unknown): readonly string[] {
    if (!Array.isArray(values)) {
        return [];
    }

    const normalized: string[] = [];

    for (const value of values) {
        if (typeof value !== "string") {
            continue;
        }

        const trimmed = value.trim();

        if (trimmed !== "") {
            normalized.push(trimmed);
        }
    }

    return normalized;
}

function normalizeWhenTypeUnknown(value: unknown): "ignore" | "report" {
    return value === "report" ? "report" : "ignore";
}

/**
 * Prevent size queries from targeting names lacking size-capable container
 * types.
 */
const noSizeQueryOnNonSizeContainerRule: StylelintPluginRuleContract =
    createStylelintRule({
        docs,
        messages,
        meta: {
            url: docs.url,
        },
        rule,
        ruleName,
    });

export default noSizeQueryOnNonSizeContainerRule;
