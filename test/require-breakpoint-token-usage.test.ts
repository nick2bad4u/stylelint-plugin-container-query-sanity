import { describe, expect, it } from "vitest";

import { lintWithConfig } from "./_internal/stylelint-test-helpers";

describe("container-query-sanity/require-breakpoint-token-usage", () => {
    it("reports hardcoded literals", async () => {
        const result = await lintWithConfig({
            code: `
                @container layout (width > 48rem) {
                    .card { gap: 1rem; }
                }
            `,
            config: {
                rules: {
                    "container-query-sanity/require-breakpoint-token-usage": true,
                },
            },
        });

        expect(result.warnings).toHaveLength(1);
        expect(result.warnings[0]?.text).not.toBe("");
    });

    it("allows tokenized literals", async () => {
        const result = await lintWithConfig({
            code: `
                @container layout (width > var(--cq-layout-md)) {
                    .card { gap: 1rem; }
                }
            `,
            config: {
                rules: {
                    "container-query-sanity/require-breakpoint-token-usage": true,
                },
            },
        });

        expect(result.warnings).toHaveLength(0);
    });
});
