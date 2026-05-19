import { describe, expect, it } from "vitest";

import { lintWithConfig } from "./_internal/stylelint-test-helpers";

describe("container-query-sanity/no-unknown-container-names", () => {
    it("accepts named queries that match container-name declarations", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: `
                .layout {
                    container-name: layout;
                    container-type: inline-size;
                }

                @container layout (width > 40rem) {
                    .card { display: grid; }
                }
            `,
            config: {
                rules: {
                    "container-query-sanity/no-unknown-container-names": true,
                },
            },
        });

        expect(result.warnings).toHaveLength(0);
    });

    it("accepts named queries that match container shorthand declarations", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: `
                .sidebar {
                    container: sidebar / inline-size;
                }

                @container sidebar (width > 48rem) {
                    .item { display: flex; }
                }
            `,
            config: {
                rules: {
                    "container-query-sanity/no-unknown-container-names": true,
                },
            },
        });

        expect(result.warnings).toHaveLength(0);
    });

    it("reports unknown container names when declarations are present", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: `
                .layout {
                    container-name: layout;
                    container-type: inline-size;
                }

                @container layuot (width > 40rem) {
                    .card { display: grid; }
                }
            `,
            config: {
                rules: {
                    "container-query-sanity/no-unknown-container-names": true,
                },
            },
        });

        expect(result.warnings).toHaveLength(1);
        expect(result.warnings[0]?.text).toContain('"layuot"');
        expect(result.warnings[0]?.text).toContain("layout");
    });

    it("skips reporting when no declarations exist and fallback mode is enabled", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: `
                @container layout (width > 40rem) {
                    .card { display: grid; }
                }
            `,
            config: {
                rules: {
                    "container-query-sanity/no-unknown-container-names": true,
                },
            },
        });

        expect(result.warnings).toHaveLength(0);
    });

    it("can report unknown names when configured to report files without declarations", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: `
                @container layout (width > 40rem) {
                    .card { display: grid; }
                }
            `,
            config: {
                rules: {
                    "container-query-sanity/no-unknown-container-names": [
                        true,
                        {
                            whenNoDeclarations: "report",
                        },
                    ],
                },
            },
        });

        expect(result.warnings).toHaveLength(1);
    });

    it("supports an explicit ignore list", async () => {
        expect.hasAssertions();

        const result = await lintWithConfig({
            code: `
                .layout {
                    container: layout / inline-size;
                }

                @container framework-shell (width > 64rem) {
                    .card { display: grid; }
                }
            `,
            config: {
                rules: {
                    "container-query-sanity/no-unknown-container-names": [
                        true,
                        {
                            ignoreNames: ["framework-shell"],
                        },
                    ],
                },
            },
        });

        expect(result.warnings).toHaveLength(0);
    });
});
