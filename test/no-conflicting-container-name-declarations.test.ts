import { describe, expect, it } from "vitest";

import { lintWithConfig } from "./_internal/stylelint-test-helpers";

const ruleName =
    "container-query-sanity/no-conflicting-container-name-declarations";

describe(ruleName, () => {
    it("accepts repeated matching container-type declarations", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: `
                .layout { container: layout / inline-size; }
                .aside { container: layout / inline-size; }
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

    it("reports conflicting type declarations for the same name", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: `
                .layout { container: layout / inline-size; }
                .modal { container: layout / size; }
            `,
            config: {
                rules: {
                    [ruleName]: true,
                },
            },
        });

        expect(result.warnings).toHaveLength(1);
        expect(result.warnings[0]?.text).toContain("inline-size, size");
    });
});
