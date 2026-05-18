import { describe, expect, it } from "vitest";

import { lintWithConfig } from "./_internal/stylelint-test-helpers";

const ruleName =
    "container-query-sanity/require-container-type-for-named-containers";

describe(ruleName, () => {
    it("accepts named containers with explicit type declarations", async () => {
        const result = await lintWithConfig({
            code: `
                .layout {
                    container-name: layout;
                    container-type: inline-size;
                }
                @container layout (inline-size >= 40rem) {
                    .card { display: grid; }
                }
            `,
            config: {
                rules: {
                    [ruleName]: true,
                },
            },
        });

        expect(result.warnings).toHaveLength(0);
        expect(result.warnings).not.toHaveLength(1);
    });

    it("reports type-dependent queries for names declared without container-type", async () => {
        const result = await lintWithConfig({
            code: `
                .layout { container-name: layout; }
                @container layout (inline-size >= 40rem) {
                    .card { display: grid; }
                }
            `,
            config: {
                rules: {
                    [ruleName]: true,
                },
            },
        });

        expect(result.warnings).toHaveLength(1);
        expect(result.warnings[0]?.text).toContain("container-type");
    });

    it("ignores style queries for normal named containers", async () => {
        const result = await lintWithConfig({
            code: `
                .layout { container-name: layout; }
                @container layout style(--theme: dark) {
                    .card { color: white; }
                }
            `,
            config: {
                rules: {
                    [ruleName]: true,
                },
            },
        });

        expect(result.warnings).toHaveLength(0);
    });
});
