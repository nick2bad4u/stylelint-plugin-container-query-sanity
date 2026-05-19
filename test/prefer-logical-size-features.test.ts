import { describe, expect, it } from "vitest";

import { lintWithConfig } from "./_internal/stylelint-test-helpers";

const ruleName = "container-query-sanity/prefer-logical-size-features";

describe(ruleName, () => {
    it("accepts logical size features", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: `
                @container layout (inline-size >= 40rem) and (block-size < 80rem) {
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

    it("reports physical width and height features", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: `
                @container layout (width >= 40rem) and (height < 80rem) {
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
        expect(result.warnings[0]?.text).toContain("height, width");
    });
});
