import { describe, expect, it } from "vitest";

import { lintWithConfig } from "./_internal/stylelint-test-helpers";

const ruleName =
    "container-query-sanity/no-block-axis-query-on-inline-size-container";

describe(ruleName, () => {
    it("accepts inline-axis queries against inline-size containers", async () => {
        const result = await lintWithConfig({
            code: `
                .layout { container: layout / inline-size; }
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

    it("reports block-axis queries against inline-size containers", async () => {
        const result = await lintWithConfig({
            code: `
                .layout { container: layout / inline-size; }
                @container layout (block-size >= 30rem) {
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
        expect(result.warnings[0]?.text).toContain("block-size");
    });

    it("accepts block-axis queries against size containers", async () => {
        const result = await lintWithConfig({
            code: `
                .layout { container: layout / size; }
                @container layout (height >= 30rem) {
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
    });
});
