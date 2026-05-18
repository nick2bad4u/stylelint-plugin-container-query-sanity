import { describe, expect, it } from "vitest";

import { lintWithConfig } from "./_internal/stylelint-test-helpers";

describe("container-query-sanity/no-size-query-on-non-size-container", () => {
    it("accepts size queries when the named container declares inline-size", async () => {
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
                    "container-query-sanity/no-size-query-on-non-size-container": true,
                },
            },
        });

        expect(result.warnings).toHaveLength(0);
    });

    it("accepts shorthand declarations with size-capable type", async () => {
        const result = await lintWithConfig({
            code: `
                .card-grid {
                    container: card-grid / size;
                }

                @container card-grid (inline-size >= 30rem) {
                    .card { display: grid; }
                }
            `,
            config: {
                rules: {
                    "container-query-sanity/no-size-query-on-non-size-container": true,
                },
            },
        });

        expect(result.warnings).toHaveLength(0);
    });

    it("reports non-size container-type declarations", async () => {
        const result = await lintWithConfig({
            code: `
                .layout {
                    container-name: layout;
                    container-type: normal;
                }

                @container layout (width > 40rem) {
                    .card { display: grid; }
                }
            `,
            config: {
                rules: {
                    "container-query-sanity/no-size-query-on-non-size-container": true,
                },
            },
        });

        expect(result.warnings).toHaveLength(1);
        expect(result.warnings[0]?.text).toContain("non-size");
    });

    it("reports named queries when only scroll-state container types are declared", async () => {
        const result = await lintWithConfig({
            code: `
                .rail {
                    container: rail / scroll-state;
                }

                @container rail (width > 40rem) {
                    .chip { display: inline-flex; }
                }
            `,
            config: {
                rules: {
                    "container-query-sanity/no-size-query-on-non-size-container": true,
                },
            },
        });

        expect(result.warnings).toHaveLength(1);
        expect(result.warnings[0]?.text).toContain("non-size");
    });

    it("skips style-only queries that do not use size features", async () => {
        const result = await lintWithConfig({
            code: `
                @container card style(--theme: dark) {
                    .card { color: white; }
                }
            `,
            config: {
                rules: {
                    "container-query-sanity/no-size-query-on-non-size-container": true,
                },
            },
        });

        expect(result.warnings).toHaveLength(0);
    });

    it("can report missing type declarations when enabled", async () => {
        const result = await lintWithConfig({
            code: `
                .layout {
                    container-name: layout;
                }

                @container layout (width > 40rem) {
                    .card { display: grid; }
                }
            `,
            config: {
                rules: {
                    "container-query-sanity/no-size-query-on-non-size-container":
                        [true, { whenTypeUnknown: "report" }],
                },
            },
        });

        expect(result.warnings).toHaveLength(1);
        expect(result.warnings[0]?.text).toContain("no static container-type");
    });

    it("treats a name as valid when at least one declaration is size-capable", async () => {
        const result = await lintWithConfig({
            code: `
                .layout-a {
                    container-name: layout;
                    container-type: normal;
                }

                .layout-b {
                    container-name: layout;
                    container-type: inline-size;
                }

                @container layout (width > 40rem) {
                    .card { display: grid; }
                }
            `,
            config: {
                rules: {
                    "container-query-sanity/no-size-query-on-non-size-container": true,
                },
            },
        });

        expect(result.warnings).toHaveLength(0);
    });
});
