import { readdirSync } from "node:fs";
import * as path from "node:path";
import { setHas } from "ts-extras";
import { describe, expect, it } from "vitest";

import { configNames, ruleNames } from "../src/plugin";

const sortLexicographically = (
    values: readonly string[]
): readonly string[] => {
    const sortedValues: string[] = [];

    for (const value of values) {
        let insertionOffset = sortedValues.length;

        for (const [index, sortedValue] of sortedValues.entries()) {
            if (value.localeCompare(sortedValue) < 0) {
                insertionOffset = index;
                break;
            }
        }

        sortedValues.splice(insertionOffset, 0, value);
    }

    return sortedValues;
};

describe("docs site catalog metadata", () => {
    it("keeps authored docs aligned with plugin exports", () => {
        expect.hasAssertions();

        const rulesDocsDirectory = path.join(process.cwd(), "docs", "rules");
        const configDocsDirectory = path.join(rulesDocsDirectory, "configs");
        const configNameSet = new Set(configNames);
        const ruleDocIds = readdirSync(rulesDocsDirectory, {
            withFileTypes: true,
        })
            .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
            .map((entry) => entry.name.replace(/\.md$/v, ""))
            .filter((docId) => ruleNames.includes(docId));
        const configDocIds = readdirSync(configDocsDirectory, {
            withFileTypes: true,
        })
            .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
            .map((entry) => entry.name.replace(/\.md$/v, ""))
            .filter((docId) => setHas(configNameSet, docId))
            .map((docId) => `configs/${docId}`);

        expect(ruleDocIds).toHaveLength(ruleNames.length);
        expect(ruleDocIds).not.toContain("__missing__");
        expect(sortLexicographically(ruleDocIds)).toStrictEqual([...ruleNames]);
        expect(configDocIds).toHaveLength(configNames.length);
        expect(sortLexicographically(configDocIds)).toStrictEqual(
            sortLexicographically(
                configNames.map((configName) => `configs/${configName}`)
            )
        );
    });
});
