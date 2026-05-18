import { describe, expect, it } from "vitest";

import { lintWithConfig } from "./_internal/stylelint-test-helpers";

const ruleName =
    "container-query-sanity/no-degenerate-container-query-conditions";

describe(ruleName, () => {
    it("accepts meaningful lower bounds", async () => {
        const result = await lintWithConfig({
            code: `
                @container layout (inline-size > 0px) and (width >= 40rem) {
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

    it("reports lower bounds that cannot filter non-negative sizes", async () => {
        const result = await lintWithConfig({
            code: `
                @container layout (inline-size >= 0px) and (width > -1px) {
                    .card { display: grid; }
                }
            `,
            config: {
                rules: {
                    [ruleName]: true,
                },
            },
        });

        expect(result.warnings).toHaveLength(2);
        expect(result.warnings[0]?.text).toContain("inline-size");
        expect(result.warnings[1]?.text).toContain("width");
    });
});
