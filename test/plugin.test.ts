import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

import {
    configNames,
    containerQuerySanityPluginConfigs,
    meta,
    type default as plugins,
    ruleIds,
    ruleNames,
    rules,
} from "../src/plugin";
import { lintWithConfig } from "./_internal/stylelint-test-helpers";

const require = createRequire(import.meta.url);

type BuiltCjsPluginModule = Readonly<{
    configNames: typeof configNames;
    containerQuerySanityPluginConfigs: typeof containerQuerySanityPluginConfigs;
    meta: typeof meta;
    ruleIds: typeof ruleIds;
    ruleNames: typeof ruleNames;
    rules: typeof rules;
}> &
    typeof plugins;

describe("stylelint-plugin-container-query-sanity runtime", () => {
    it("exports stable package metadata", () => {
        expect.hasAssertions();

        expect(meta.name).toBe("stylelint-plugin-container-query-sanity");
        expect(meta.namespace).toBe("container-query-sanity");
        expect(meta.version).toMatch(/^\d+\.\d+\.\d+/v);
    });

    it("keeps rule registry exports internally consistent", () => {
        expect.hasAssertions();

        expect(ruleNames).toHaveLength(ruleIds.length);
        expect(Object.keys(rules)).toStrictEqual([...ruleNames]);

        for (const ruleId of ruleIds) {
            expect(ruleId).toMatch(/^container-query-sanity\//v);
        }
    });

    it("preserves named exports on the built CommonJS entrypoint", () => {
        expect.hasAssertions();

        const builtCjsPlugin =
            require("../dist/plugin.cjs") as BuiltCjsPluginModule;

        expect(builtCjsPlugin).toBeInstanceOf(Array);
        expect(
            Object.keys(builtCjsPlugin.containerQuerySanityPluginConfigs)
        ).toStrictEqual(Object.keys(containerQuerySanityPluginConfigs));

        expect(
            builtCjsPlugin.containerQuerySanityPluginConfigs[
                "container-query-all"
            ]?.rules
        ).toStrictEqual(
            containerQuerySanityPluginConfigs["container-query-all"]?.rules
        );
        expect(builtCjsPlugin.meta).toStrictEqual(meta);
        expect(builtCjsPlugin.ruleIds).toStrictEqual(ruleIds);
        expect(builtCjsPlugin.ruleNames).toStrictEqual(ruleNames);
    });

    it("exposes the expected shareable config names", () => {
        expect.hasAssertions();

        expect(configNames).toStrictEqual([
            "container-query-all",
            "container-query-recommended",
            "container-query-strict",
        ]);
        expect(Object.keys(containerQuerySanityPluginConfigs)).toStrictEqual([
            "container-query-all",
            "container-query-recommended",
            "container-query-strict",
        ]);
    });

    it("lets the recommended config lint baseline CSS without parse errors", async () => {
        expect.hasAssertions();

        const recommendedConfig =
            containerQuerySanityPluginConfigs["container-query-recommended"];
        const plugins = Array.isArray(recommendedConfig.plugins)
            ? Array.from(recommendedConfig.plugins)
            : [recommendedConfig.plugins];

        const result = await lintWithConfig({
            code: `
                .card {
                    display: grid;
                }
            `,
            config: {
                ...recommendedConfig,
                plugins,
            },
        });

        expect(result.parseErrors).toHaveLength(0);
        expect(result.warnings).toHaveLength(0);
    });
});
