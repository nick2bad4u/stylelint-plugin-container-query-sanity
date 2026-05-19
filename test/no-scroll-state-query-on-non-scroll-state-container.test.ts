import { describe, expect, it } from "vitest";

import { lintWithConfig } from "./_internal/stylelint-test-helpers";

const ruleName =
    "container-query-sanity/no-scroll-state-query-on-non-scroll-state-container";

describe(ruleName, () => {
    it("accepts scroll-state queries against scroll-state containers", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: `
                .pane { container: pane / scroll-state; }
                @container pane scroll-state(stuck: top) {
                    .pane-title { position: sticky; }
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

    it("reports scroll-state queries against size-only containers", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: `
                .pane { container: pane / inline-size; }
                @container pane scroll-state(stuck: top) {
                    .pane-title { position: sticky; }
                }
            `,
            config: {
                rules: {
                    [ruleName]: true,
                },
            },
        });

        expect(result.warnings).toHaveLength(1);
        expect(result.warnings[0]?.text).toContain("scroll-state");
    });

    it("ignores unnamed scroll-state queries", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: `
                @container scroll-state(stuck: top) {
                    .pane-title { position: sticky; }
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
