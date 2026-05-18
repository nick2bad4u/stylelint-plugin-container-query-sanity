/**
 * @packageDocumentation
 * Helpers for collecting static container-name and container-type declarations.
 */
import type { Root } from "postcss";

import { arrayIncludes, isEmpty, setHas } from "ts-extras";

import { isValidContainerName } from "./container-query-analysis.js";

/** Static declaration summary for one named container. */
export type ContainerTypeSummary = Readonly<{
    declarations: readonly string[];
    hasBlockSizeContainment: boolean;
    hasInlineSizeContainment: boolean;
    hasNormal: boolean;
    hasScrollState: boolean;
    hasTypeDeclaration: boolean;
    hasUnknown: boolean;
}>;

interface MutableContainerTypeSummary {
    declarations: string[];
    hasBlockSizeContainment: boolean;
    hasInlineSizeContainment: boolean;
    hasNormal: boolean;
    hasScrollState: boolean;
    hasTypeDeclaration: boolean;
    hasUnknown: boolean;
}

const containerTypeKeywords = new Set([
    "inline-size",
    "normal",
    "scroll-state",
    "size",
]);
const cssWideKeywords = new Set([
    "inherit",
    "initial",
    "revert",
    "revert-layer",
    "unset",
]);

/** Collect declared container names and their static container-type summaries. */
export function collectContainerTypesByName(
    root: Root
): ReadonlyMap<string, ContainerTypeSummary> {
    const summaries = new Map<string, MutableContainerTypeSummary>();

    root.walkRules((ruleNode) => {
        const namesFromLonghands: string[] = [];
        let lastLonghandSummary: ContainerTypeSummary | null = null;

        ruleNode.walkDecls((declaration) => {
            const property = declaration.prop.trim().toLowerCase();

            if (property === "container-name") {
                namesFromLonghands.push(
                    ...extractNamesFromContainerNameValue(declaration.value)
                );
                return;
            }

            if (property === "container-type") {
                lastLonghandSummary = parseContainerTypeValue(
                    declaration.value
                );
                return;
            }

            if (property === "container") {
                const shorthand = parseContainerShorthand(declaration.value);

                for (const name of shorthand.names) {
                    mergeSummary(summaries, name, shorthand.summary);
                }
            }
        });

        for (const name of namesFromLonghands) {
            mergeSummary(summaries, name, lastLonghandSummary);
        }
    });

    return summaries;
}

/** Collect declared container names without type details. */
export function collectDeclaredContainerNames(root: Root): ReadonlySet<string> {
    return new Set(collectContainerTypesByName(root).keys());
}

/** Split CSS whitespace-delimited tokens without treating comments specially. */
export function splitWhitespaceTokens(value: string): readonly string[] {
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

function containsDynamicFunction(value: string): boolean {
    const normalized = value.toLowerCase();

    return normalized.includes("env(") || normalized.includes("var(");
}

function createEmptySummary(): MutableContainerTypeSummary {
    return {
        declarations: [],
        hasBlockSizeContainment: false,
        hasInlineSizeContainment: false,
        hasNormal: false,
        hasScrollState: false,
        hasTypeDeclaration: false,
        hasUnknown: false,
    };
}

function createNormalSummary(): ContainerTypeSummary {
    return {
        declarations: ["normal"],
        hasBlockSizeContainment: false,
        hasInlineSizeContainment: false,
        hasNormal: true,
        hasScrollState: false,
        hasTypeDeclaration: true,
        hasUnknown: false,
    };
}

function createUnknownSummary(declaration: string): ContainerTypeSummary {
    return {
        declarations: [declaration],
        hasBlockSizeContainment: false,
        hasInlineSizeContainment: false,
        hasNormal: false,
        hasScrollState: false,
        hasTypeDeclaration: true,
        hasUnknown: true,
    };
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

function mergeSummary(
    summaries: Map<string, MutableContainerTypeSummary>,
    name: string,
    nextSummary: ContainerTypeSummary | null
): void {
    const target = summaries.get(name) ?? createEmptySummary();

    if (!summaries.has(name)) {
        summaries.set(name, target);
    }

    if (nextSummary === null) {
        return;
    }

    target.declarations.push(...nextSummary.declarations);
    target.hasBlockSizeContainment ||= nextSummary.hasBlockSizeContainment;
    target.hasInlineSizeContainment ||= nextSummary.hasInlineSizeContainment;
    target.hasNormal ||= nextSummary.hasNormal;
    target.hasScrollState ||= nextSummary.hasScrollState;
    target.hasTypeDeclaration ||= nextSummary.hasTypeDeclaration;
    target.hasUnknown ||= nextSummary.hasUnknown;
}

function parseContainerShorthand(value: string): Readonly<{
    names: readonly string[];
    summary: ContainerTypeSummary | null;
}> {
    const trimmedValue = value.trim();

    if (trimmedValue === "") {
        return {
            names: [],
            summary: null,
        };
    }

    if (containsDynamicFunction(trimmedValue)) {
        return {
            names: [],
            summary: createUnknownSummary(trimmedValue),
        };
    }

    const slashIndex = trimmedValue.indexOf("/");
    const namePart =
        slashIndex === -1
            ? trimmedValue
            : trimmedValue.slice(0, slashIndex).trim();
    const kindPart =
        slashIndex === -1 ? "" : trimmedValue.slice(slashIndex + 1).trim();
    const lowercaseNamePart = namePart.toLowerCase();

    if (
        namePart === "" ||
        setHas(cssWideKeywords, lowercaseNamePart) ||
        lowercaseNamePart === "none"
    ) {
        return {
            names: [],
            summary: parseContainerTypeValue(kindPart),
        };
    }

    const tokens = splitWhitespaceTokens(namePart);

    if (
        slashIndex === -1 &&
        tokens.every((token) => setHas(containerTypeKeywords, token))
    ) {
        return {
            names: [],
            summary: parseContainerTypeValue(namePart),
        };
    }

    const names: string[] = [];

    for (const token of tokens) {
        const lowercaseToken = token.toLowerCase();

        if (lowercaseToken !== "none" && isValidContainerName(token)) {
            names.push(token);
        }
    }

    return {
        names,
        summary:
            slashIndex === -1
                ? createNormalSummary()
                : parseContainerTypeValue(kindPart),
    };
}

function parseContainerTypeValue(value: string): ContainerTypeSummary | null {
    const trimmedValue = value.trim();
    const lowercaseValue = trimmedValue.toLowerCase();

    if (trimmedValue === "") {
        return null;
    }

    if (
        setHas(cssWideKeywords, lowercaseValue) ||
        containsDynamicFunction(trimmedValue)
    ) {
        return createUnknownSummary(trimmedValue);
    }

    const tokens = splitWhitespaceTokens(lowercaseValue);

    if (isEmpty(tokens)) {
        return null;
    }

    if (tokens.some((token) => !setHas(containerTypeKeywords, token))) {
        return createUnknownSummary(trimmedValue);
    }

    return {
        declarations: [lowercaseValue],
        hasBlockSizeContainment: arrayIncludes(tokens, "size"),
        hasInlineSizeContainment:
            arrayIncludes(tokens, "inline-size") ||
            arrayIncludes(tokens, "size"),
        hasNormal: arrayIncludes(tokens, "normal"),
        hasScrollState: arrayIncludes(tokens, "scroll-state"),
        hasTypeDeclaration: true,
        hasUnknown: false,
    };
}
