/**
 * @packageDocumentation
 * Public plugin entrypoint for stylelint-plugin-container-query-sanity exports.
 */
import type { Config, Plugin as StylelintPlugin } from "stylelint";

import { isDefined, objectKeys } from "ts-extras";

import type { StylelintPluginRuleContract } from "./_internal/create-stylelint-rule.js";

import {
    CONFIG_NAMES as configNamesValue,
    type ContainerQueryConfigName as InternalContainerQueryConfigName,
    PACKAGE_NAME as packageNameValue,
    PACKAGE_VERSION as packageVersionValue,
    PLUGIN_NAMESPACE as pluginNamespaceValue,
} from "./_internal/plugin-constants.js";
import { containerQuerySanityRules as runtimeRulesValue } from "./_internal/rules-registry.js";

/** Map of public config names to shareable stylelint config objects. */
export type ContainerQueryConfigMap = Record<
    ContainerQueryConfigName,
    ContainerQueryShareableConfig
>;
/** Public shareable config names exported by this plugin package. */
export type ContainerQueryConfigName = InternalContainerQueryConfigName;
/** Fully qualified stylelint rule ID (`namespace/rule-name`). */
export type ContainerQueryRuleId = `${typeof pluginNamespaceValue}/${string}`;
/** Rule names keyed in this plugin package. */
export type ContainerQueryRuleName = Extract<
    keyof typeof runtimeRulesValue,
    string
>;

/** Shape of exported shareable stylelint config objects. */
export type ContainerQueryShareableConfig = Config & {
    plugins: (string | StylelintPlugin)[];
    rules: NonNullable<Config["rules"]>;
};

type RuleEntry = readonly [string, StylelintPluginRuleContract];
type RulesMap = Readonly<Record<string, StylelintPluginRuleContract>>;

const packageMetaName = packageNameValue;
const packageMetaNamespace = pluginNamespaceValue;
const packageMetaVersion = packageVersionValue;
const runtimeRules = runtimeRulesValue;
const publicConfigNames = configNamesValue;
const ruleNamePrefix = `${pluginNamespaceValue}/` as const;

/** Package metadata surfaced for docs, tooling, and introspection. */
export const meta: Readonly<{
    name: string;
    namespace: string;
    version: string;
}> = {
    name: packageMetaName,
    namespace: packageMetaNamespace,
    version: packageMetaVersion,
};

/** Runtime rule contracts indexed by short rule name. */
export const rules: RulesMap = runtimeRules;

/** Deterministic sorted list of exported rule names. */
export const ruleNames: readonly string[] = objectKeys(rules).toSorted(
    (left, right) => left.localeCompare(right)
);

function isContainerQueryRuleId(value: string): value is ContainerQueryRuleId {
    return value.startsWith(ruleNamePrefix);
}

const ruleEntries: readonly RuleEntry[] = (() => {
    const entries: RuleEntry[] = [];

    for (const ruleName of ruleNames) {
        const rule = rules[ruleName];

        if (isDefined(rule)) {
            entries.push([ruleName, rule]);
        }
    }

    return entries;
})();

/** Ordered plugin list consumed by stylelint `plugins` config field. */
export const plugins: readonly StylelintPlugin[] = ruleEntries.map(
    ([, rule]) => rule
);

/** Ordered fully-qualified rule IDs. */
export const ruleIds: readonly ContainerQueryRuleId[] = ruleEntries.map(
    ([, rule]) => {
        if (!isContainerQueryRuleId(rule.ruleName)) {
            throw new TypeError(`Unexpected rule name: ${rule.ruleName}`);
        }

        return rule.ruleName;
    }
);

const recommendedRuleIds: readonly ContainerQueryRuleId[] = ruleEntries
    .filter(([, rule]) => rule.docs.recommended)
    .map(([, rule]) => {
        if (!isContainerQueryRuleId(rule.ruleName)) {
            throw new TypeError(`Unexpected rule name: ${rule.ruleName}`);
        }

        return rule.ruleName;
    });

const strictOnlyRuleNameSuffixes = new Set([
    "/no-block-axis-query-on-inline-size-container",
    "/no-conflicting-container-name-declarations",
    "/no-degenerate-container-query-conditions",
    "/no-scroll-state-query-on-non-scroll-state-container",
    "/no-size-query-on-non-size-container",
    "/no-unknown-container-names",
    "/prefer-logical-size-features",
    "/prefer-range-syntax",
    "/require-breakpoint-token-usage",
    "/require-container-type-for-named-containers",
]);
const isStrictOnlyRule = (ruleId: string): boolean => {
    for (const suffix of strictOnlyRuleNameSuffixes) {
        if (ruleId.endsWith(suffix)) {
            return true;
        }
    }

    return false;
};

const strictRuleIds: readonly ContainerQueryRuleId[] = ruleEntries
    .filter(
        ([, rule]) => rule.docs.recommended || isStrictOnlyRule(rule.ruleName)
    )
    .map(([, rule]) => {
        if (!isContainerQueryRuleId(rule.ruleName)) {
            throw new TypeError(`Unexpected rule name: ${rule.ruleName}`);
        }

        return rule.ruleName;
    });

function createConfig(
    enabledRuleIds: readonly ContainerQueryRuleId[]
): ContainerQueryShareableConfig {
    return {
        plugins: [...plugins],
        rules: (() => {
            const rulesConfig: NonNullable<Config["rules"]> = {};

            for (const ruleId of enabledRuleIds) {
                rulesConfig[ruleId] = ruleId.endsWith(
                    "/require-breakpoint-token-usage"
                )
                    ? [
                          true,
                          {
                              allowedUnits: [
                                  "cqi",
                                  "cqb",
                                  "cqw",
                                  "cqh",
                                  "cqmin",
                                  "cqmax",
                              ],
                          },
                      ]
                    : true;
            }

            return rulesConfig;
        })(),
    };
}

/** Named shareable configs exported by this plugin package. */
export const containerQuerySanityPluginConfigs: ContainerQueryConfigMap = {
    "container-query-all": createConfig(ruleIds),
    "container-query-recommended": createConfig(recommendedRuleIds),
    "container-query-strict": createConfig(strictRuleIds),
};

/** Ordered config names used by docs and validation tooling. */
export const configNames: readonly ContainerQueryConfigName[] =
    publicConfigNames;

export default plugins;
