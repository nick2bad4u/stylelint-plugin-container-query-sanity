/**
 * @packageDocumentation
 * Canonical registry of public Stylelint rules exported by this package.
 */
import type { StylelintPluginRuleContract } from "./create-stylelint-rule.js";

import * as noBlockAxisQueryOnInlineSizeContainerModule from "../rules/no-block-axis-query-on-inline-size-container.js";
import * as noConflictingContainerNameDeclarationsModule from "../rules/no-conflicting-container-name-declarations.js";
import * as noDegenerateContainerQueryConditionsModule from "../rules/no-degenerate-container-query-conditions.js";
import * as noInvalidContainerQueryRangesModule from "../rules/no-invalid-container-query-ranges.js";
import * as noScrollStateQueryOnNonScrollStateContainerModule from "../rules/no-scroll-state-query-on-non-scroll-state-container.js";
import * as noSizeQueryOnNonSizeContainerModule from "../rules/no-size-query-on-non-size-container.js";
import * as noUnknownContainerNamesModule from "../rules/no-unknown-container-names.js";
import * as noUnreachableContainerIntervalsModule from "../rules/no-unreachable-container-intervals.js";
import * as preferLogicalSizeFeaturesModule from "../rules/prefer-logical-size-features.js";
import * as preferRangeSyntaxModule from "../rules/prefer-range-syntax.js";
import * as requireBreakpointTokenUsageModule from "../rules/require-breakpoint-token-usage.js";
import * as requireContainerTypeForNamedContainersModule from "../rules/require-container-type-for-named-containers.js";
import * as requireNamedContainerModule from "../rules/require-named-container.js";

/** Public rule registry keyed by unqualified rule name. */
export const containerQuerySanityRules: Readonly<
    Record<string, StylelintPluginRuleContract>
> = {
    "no-block-axis-query-on-inline-size-container":
        noBlockAxisQueryOnInlineSizeContainerModule.default,
    "no-conflicting-container-name-declarations":
        noConflictingContainerNameDeclarationsModule.default,
    "no-degenerate-container-query-conditions":
        noDegenerateContainerQueryConditionsModule.default,
    "no-invalid-container-query-ranges":
        noInvalidContainerQueryRangesModule.default,
    "no-scroll-state-query-on-non-scroll-state-container":
        noScrollStateQueryOnNonScrollStateContainerModule.default,
    "no-size-query-on-non-size-container":
        noSizeQueryOnNonSizeContainerModule.default,
    "no-unknown-container-names": noUnknownContainerNamesModule.default,
    "no-unreachable-container-intervals":
        noUnreachableContainerIntervalsModule.default,
    "prefer-logical-size-features": preferLogicalSizeFeaturesModule.default,
    "prefer-range-syntax": preferRangeSyntaxModule.default,
    "require-breakpoint-token-usage": requireBreakpointTokenUsageModule.default,
    "require-container-type-for-named-containers":
        requireContainerTypeForNamedContainersModule.default,
    "require-named-container": requireNamedContainerModule.default,
};

/** Public rule registry type. */
export type ContainerQuerySanityRulesRegistry =
    typeof containerQuerySanityRules;
