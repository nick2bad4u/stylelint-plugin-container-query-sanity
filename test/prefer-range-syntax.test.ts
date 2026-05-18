import { describe, expect, it } from "vitest";

import { lintWithConfig } from "./_internal/stylelint-test-helpers";

describe("container-query-sanity/prefer-range-syntax", () => {
    it("accepts modern range syntax", async () => {
        const result = await lintWithConfig({
            code: `
                @container layout (width >= 40rem) and (inline-size < 70rem) {
                    .card { display: grid; }
                }
            `,
            config: {
                rules: {
                    "container-query-sanity/prefer-range-syntax": true,
                },
            },
        });

        expect(result.warnings).toHaveLength(0);
        expect(result.warnings).not.toHaveLength(1);
    });

    it("reports legacy min-/max- syntax", async () => {
        const result = await lintWithConfig({
            code: `
                @container card (min-width: 40rem) and (max-inline-size: 70rem) {
                    .card { display: grid; }
                }
            `,
            config: {
                rules: {
                    "container-query-sanity/prefer-range-syntax": true,
                },
            },
        });

        expect(result.warnings).toHaveLength(2);
        expect(result.warnings[0]?.text).toContain("width >= 40rem");
        expect(result.warnings[1]?.text).toContain("inline-size <= 70rem");
    });

    it("ignores style queries", async () => {
        const result = await lintWithConfig({
            code: `
                @container style(--theme: dark) {
                    .card { display: grid; }
                }
            `,
            config: {
                rules: {
                    "container-query-sanity/prefer-range-syntax": true,
                },
            },
        });

        expect(result.warnings).toHaveLength(0);
    });
});
