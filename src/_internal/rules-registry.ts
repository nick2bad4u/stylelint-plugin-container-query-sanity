/**
 * @packageDocumentation
 * Canonical registry of public Stylelint rules exported by this package.
 */
import type { StylelintPluginRuleContract } from "./create-stylelint-rule.js";

import * as noInvalidContainerQueryRangesModule from "../rules/no-invalid-container-query-ranges.js";
import * as noSizeQueryOnNonSizeContainerModule from "../rules/no-size-query-on-non-size-container.js";
import * as noUnknownContainerNamesModule from "../rules/no-unknown-container-names.js";
import * as noUnreachableContainerIntervalsModule from "../rules/no-unreachable-container-intervals.js";
import * as preferRangeSyntaxModule from "../rules/prefer-range-syntax.js";
import * as requireBreakpointTokenUsageModule from "../rules/require-breakpoint-token-usage.js";
import * as requireNamedContainerModule from "../rules/require-named-container.js";

/** Public rule registry keyed by unqualified rule name. */
export const containerQuerySanityRules: Readonly<
    Record<string, StylelintPluginRuleContract>
> = {
    "no-invalid-container-query-ranges":
        noInvalidContainerQueryRangesModule.default,
    "no-size-query-on-non-size-container":
        noSizeQueryOnNonSizeContainerModule.default,
    "no-unknown-container-names": noUnknownContainerNamesModule.default,
    "no-unreachable-container-intervals":
        noUnreachableContainerIntervalsModule.default,
    "prefer-range-syntax": preferRangeSyntaxModule.default,
    "require-breakpoint-token-usage": requireBreakpointTokenUsageModule.default,
    "require-named-container": requireNamedContainerModule.default,
};

/** Public rule registry type. */
export type ContainerQuerySanityRulesRegistry =
    typeof containerQuerySanityRules;
