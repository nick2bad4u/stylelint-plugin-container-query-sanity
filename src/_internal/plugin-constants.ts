/**
 * @packageDocumentation
 * Static package metadata and helper factories for namespaced rule exports.
 */
import type { ArrayValues } from "type-fest";

// eslint-disable-next-line import-x/extensions -- Native JSON module specifiers require the explicit .json suffix.
import packageJson from "../../package.json" with { type: "json" };

/** Public npm package name. */
export const PACKAGE_NAME = "stylelint-plugin-container-query-sanity";
/** Public Stylelint rule namespace. */
export const PLUGIN_NAMESPACE = "container-query-sanity";
/** Public GitHub repository URL. */
export const REPOSITORY_URL =
    "https://github.com/Nick2bad4u/stylelint-plugin-container-query-sanity";
/** Public documentation site URL. */
export const DOCS_SITE_URL =
    "https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity";
/** Base URL for authored rule documentation. */
export const DOCS_RULES_BASE_URL: `${string}/docs/rules` = `${DOCS_SITE_URL}/docs/rules`;
/** Supported shareable config names exported by this package. */
export const CONFIG_NAMES = [
    "container-query-all",
    "container-query-recommended",
    "container-query-strict",
] as const;

/** Shareable config names exported by the plugin runtime. */
export type ContainerQueryConfigName = ArrayValues<typeof CONFIG_NAMES>;

function getPackageVersion(pkg: unknown): string {
    return hasPackageVersion(pkg) ? pkg.version : "0.0.0";
}

function hasPackageVersion(pkg: unknown): pkg is Readonly<{ version: string }> {
    return (
        typeof pkg === "object" &&
        pkg !== null &&
        typeof Reflect.get(pkg, "version") === "string"
    );
}

/** Published package version resolved from `package.json`. */
export const PACKAGE_VERSION: string = getPackageVersion(packageJson);

/**
 * Create the canonical docs URL for one authored rule page.
 */
export function createRuleDocsUrl(ruleName: string): string {
    return `${DOCS_RULES_BASE_URL}/${ruleName}`;
}

/**
 * Create a fully qualified Stylelint rule name for this plugin namespace.
 */
export function createRuleName<const T extends string>(
    ruleName: T
): `${typeof PLUGIN_NAMESPACE}/${T}` {
    return `${PLUGIN_NAMESPACE}/${ruleName}`;
}
