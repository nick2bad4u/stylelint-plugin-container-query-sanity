import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { configNames, ruleNames } from "../src/plugin";

describe("docs guardrails", () => {
    it("keeps required docs pages present for all exported configs and rules", async () => {
        for (const configName of configNames) {
            const configDocPath = fileURLToPath(
                new URL(
                    `../docs/rules/configs/${configName}.md`,
                    import.meta.url
                )
            );
            const configDocContent = await readFile(configDocPath, "utf8");

            expect(configDocContent.length).toBeGreaterThan(0);
        }

        for (const ruleName of ruleNames) {
            const ruleDocPath = fileURLToPath(
                new URL(`../docs/rules/${ruleName}.md`, import.meta.url)
            );
            const ruleDocContent = await readFile(ruleDocPath, "utf8");

            expect(ruleDocContent.length).toBeGreaterThan(0);
        }

        expect(ruleNames).not.toContain("__missing__");
    });
});
