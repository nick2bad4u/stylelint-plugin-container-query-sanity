/**
 * @packageDocumentation
 * Rule preventing size queries from targeting containers without size containment.
 */
import type { Root } from "postcss";

import stylelint, { type PostcssResult } from "stylelint";
import { arrayIncludes, isDefined, isEmpty, setHas } from "ts-extras";

import {
    collectFeatureConstraints,
    isValidContainerName,
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

type CapabilitySummary = Readonly<{
    hasNonSize: boolean;
    hasSizeCapable: boolean;
    hasUnknown: boolean;
}>;

type ContainerCapability = "non-size" | "size-capable" | "unknown";

type NoSizeQueryOnNonSizeContainerSecondaryOptions = Readonly<{
    ignoreNames?: readonly string[];
    whenTypeUnknown?: "ignore" | "report";
}>;

const cssWideKeywords = new Set([
    "inherit",
    "initial",
    "revert",
    "revert-layer",
    "unset",
]);
const knownContainerTypeTokens = new Set([
    "inline-size",
    "normal",
    "scroll-state",
    "size",
]);

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
    (root: Root, result: PostcssResult) => {
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
        const capabilityByName = collectContainerTypeCapabilitiesByName(root);

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

            const summary = capabilityByName.get(containerName);

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

            if (summary.hasSizeCapable) {
                return;
            }

            report({
                message: summary.hasNonSize
                    ? messages.nonSizeType(containerName)
                    : messages.unknownType(containerName),
                node: atRule,
                result,
                ruleName,
            });
        });
    };

function collectContainerTypeCapabilitiesByName(
    root: Root
): ReadonlyMap<string, CapabilitySummary> {
    const capabilities = new Map<string, CapabilitySummary>();

    root.walkRules((ruleNode) => {
        const namesFromContainerNameDecls: string[] = [];
        let hasCapabilityDeclaration = false;
        let lastRuleCapability: ContainerCapability = "unknown";

        ruleNode.walkDecls((declaration) => {
            const property = declaration.prop.trim().toLowerCase();

            if (property === "container-name") {
                namesFromContainerNameDecls.push(
                    ...extractNamesFromContainerNameValue(declaration.value)
                );
                return;
            }

            if (property === "container-type") {
                const capability = parseContainerCapability(
                    declaration.value.trim()
                );

                if (isDefined(capability)) {
                    hasCapabilityDeclaration = true;
                    lastRuleCapability = capability;
                }

                return;
            }

            if (property !== "container") {
                return;
            }

            const shorthand = parseContainerShorthand(declaration.value);

            if (isEmpty(shorthand.names)) {
                return;
            }

            if (isDefined(shorthand.capability)) {
                for (const name of shorthand.names) {
                    mergeCapability(capabilities, name, shorthand.capability);
                }
            }
        });

        if (!hasCapabilityDeclaration || isEmpty(namesFromContainerNameDecls)) {
            return;
        }

        for (const name of namesFromContainerNameDecls) {
            mergeCapability(capabilities, name, lastRuleCapability);
        }
    });

    return capabilities;
}

function containsDynamicFunction(value: string): boolean {
    const normalized = value.toLowerCase();

    return normalized.includes("env(") || normalized.includes("var(");
}

function extractNamesFromContainerNameValue(value: string): readonly string[] {
    const trimmedValue = value.trim();
    const lowercaseValue = trimmedValue.toLowerCase();

    if (
        trimmedValue === "" ||
        setHas(cssWideKeywords, lowercaseValue) ||
        containsDynamicFunction(trimmedValue)
    ) {
        return [];
    }

    const names: string[] = [];

    for (const token of splitWhitespaceTokens(trimmedValue)) {
        const lowercaseToken = token.toLowerCase();

        if (lowercaseToken !== "none" && isValidContainerName(token)) {
            names.push(token);
        }
    }

    return names;
}

function mergeCapability(
    capabilities: Map<string, CapabilitySummary>,
    name: string,
    capability: ContainerCapability
): void {
    const existing = capabilities.get(name) ?? {
        hasNonSize: false,
        hasSizeCapable: false,
        hasUnknown: false,
    };
    const next: CapabilitySummary =
        capability === "size-capable"
            ? {
                  ...existing,
                  hasSizeCapable: true,
              }
            : capability === "non-size"
              ? {
                    ...existing,
                    hasNonSize: true,
                }
              : {
                    ...existing,
                    hasUnknown: true,
                };

    capabilities.set(name, next);
}

function normalizeIgnoreNames(values: unknown): readonly string[] {
    if (!Array.isArray(values)) {
        return [];
    }

    const normalized: string[] = [];

    for (const value of values) {
        if (typeof value === "string") {
            const trimmed = value.trim();

            if (trimmed !== "") {
                normalized.push(trimmed);
            }
        }
    }

    return normalized;
}

function normalizeWhenTypeUnknown(value: unknown): "ignore" | "report" {
    return value === "report" ? "report" : "ignore";
}

function parseContainerCapability(
    trimmedValue: string
): ContainerCapability | undefined {
    const lowercaseValue = trimmedValue.toLowerCase();

    if (
        trimmedValue === "" ||
        setHas(cssWideKeywords, lowercaseValue) ||
        containsDynamicFunction(trimmedValue)
    ) {
        return undefined;
    }

    const tokens = splitWhitespaceTokens(lowercaseValue);

    if (isEmpty(tokens)) {
        return undefined;
    }

    if (
        tokens.some(
            (token) =>
                !setHas(knownContainerTypeTokens, token) && token !== "none"
        )
    ) {
        return "unknown";
    }

    if (arrayIncludes(tokens, "size") || arrayIncludes(tokens, "inline-size")) {
        return "size-capable";
    }

    if (
        arrayIncludes(tokens, "normal") ||
        arrayIncludes(tokens, "scroll-state")
    ) {
        return "non-size";
    }

    return "unknown";
}

function parseContainerShorthand(value: string): Readonly<{
    capability?: ContainerCapability;
    names: readonly string[];
}> {
    const trimmedValue = value.trim();

    if (trimmedValue === "" || containsDynamicFunction(trimmedValue)) {
        return { names: [] };
    }

    const slashIndex = trimmedValue.indexOf("/");
    const namePart =
        slashIndex === -1
            ? trimmedValue
            : trimmedValue.slice(0, slashIndex).trim();
    const capabilityPart =
        slashIndex === -1 ? "" : trimmedValue.slice(slashIndex + 1).trim();
    const lowercaseNamePart = namePart.toLowerCase();

    if (
        namePart === "" ||
        setHas(cssWideKeywords, lowercaseNamePart) ||
        lowercaseNamePart === "none"
    ) {
        const capability = parseContainerCapability(capabilityPart);

        return {
            names: [],
            ...(isDefined(capability) ? { capability } : {}),
        };
    }

    const tokens = splitWhitespaceTokens(namePart);

    if (
        slashIndex === -1 &&
        tokens.every((token) => setHas(knownContainerTypeTokens, token))
    ) {
        const capability = parseContainerCapability(namePart);

        return {
            names: [],
            ...(isDefined(capability) ? { capability } : {}),
        };
    }

    const names: string[] = [];

    for (const token of tokens) {
        const lowercaseToken = token.toLowerCase();

        if (lowercaseToken !== "none" && isValidContainerName(token)) {
            names.push(token);
        }
    }

    const capability = parseContainerCapability(capabilityPart);

    return {
        ...(isDefined(capability) ? { capability } : {}),
        names,
    };
}

function splitWhitespaceTokens(value: string): readonly string[] {
    const tokens: string[] = [];
    let currentToken = "";

    for (const character of value) {
        const isWhitespaceCharacter =
            character === " " ||
            character === "\n" ||
            character === "\r" ||
            character === "\t";

        if (isWhitespaceCharacter) {
            if (currentToken !== "") {
                tokens.push(currentToken);
                currentToken = "";
            }
        } else {
            currentToken += character;
        }
    }

    if (currentToken !== "") {
        tokens.push(currentToken);
    }

    return tokens;
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
