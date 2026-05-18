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
    it("keeps the sidebar-derived catalog aligned with plugin exports", async () => {
        const docsCatalogModule =
            (await import("../docs/docusaurus/src/data/docsCatalog")) as {
                docsCatalogStats: {
                    configDocIds: readonly string[];
                    publicRuleCount: number;
                    ruleDocIds: readonly string[];
                    shareableConfigCount: number;
                };
            };

        const { docsCatalogStats } = docsCatalogModule;

        expect(docsCatalogStats.publicRuleCount).toBe(ruleNames.length);
        expect(
            sortLexicographically([...docsCatalogStats.ruleDocIds])
        ).toStrictEqual([...ruleNames]);
        expect(docsCatalogStats.ruleDocIds).not.toContain("__missing__");
        expect(docsCatalogStats.shareableConfigCount).toBe(configNames.length);
        expect(
            sortLexicographically([...docsCatalogStats.configDocIds])
        ).toStrictEqual(
            sortLexicographically(
                configNames.map((configName) => `configs/${configName}`)
            )
        );
    });
});
