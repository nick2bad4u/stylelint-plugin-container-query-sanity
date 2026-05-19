import { describe, expect, it } from "vitest";

import { lintWithConfig } from "./_internal/stylelint-test-helpers";

describe("container-query-sanity/require-named-container", () => {
    it("reports anonymous container queries", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: `
                @container (width > 40rem) {
                    .card { display: grid; }
                }
            `,
            config: {
                rules: {
                    "container-query-sanity/require-named-container": true,
                },
            },
        });

        expect(result.warnings).toHaveLength(1);
        expect(result.warnings[0]?.text).not.toBe("");
    });

    it("accepts named container queries", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: `
                @container layout (width > 40rem) {
                    .card { display: grid; }
                }
            `,
            config: {
                rules: {
                    "container-query-sanity/require-named-container": true,
                },
            },
        });

        expect(result.warnings).toHaveLength(0);
    });
});
