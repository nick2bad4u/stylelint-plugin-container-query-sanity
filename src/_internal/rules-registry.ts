/**
 * @packageDocumentation
 * Canonical registry of public Stylelint rules exported by this package.
 */
/* eslint-disable import-x/max-dependencies -- This registry is the single place that aggregates every public rule entrypoint. */
import type { StylelintPluginRuleContract } from "./create-stylelint-rule.js";

import noBlockAxisQueryOnInlineSizeContainerRule from "../rules/no-block-axis-query-on-inline-size-container.js";
import noConflictingContainerNameDeclarationsRule from "../rules/no-conflicting-container-name-declarations.js";
import noDegenerateContainerQueryConditionsRule from "../rules/no-degenerate-container-query-conditions.js";
import noInvalidContainerQueryRangesRule from "../rules/no-invalid-container-query-ranges.js";
import noScrollStateQueryOnNonScrollStateContainerRule from "../rules/no-scroll-state-query-on-non-scroll-state-container.js";
import noSizeQueryOnNonSizeContainerRule from "../rules/no-size-query-on-non-size-container.js";
import noUnknownContainerNamesRule from "../rules/no-unknown-container-names.js";
import noUnreachableContainerIntervalsRule from "../rules/no-unreachable-container-intervals.js";
import preferLogicalSizeFeaturesRule from "../rules/prefer-logical-size-features.js";
import preferRangeSyntaxRule from "../rules/prefer-range-syntax.js";
import requireBreakpointTokenUsageRule from "../rules/require-breakpoint-token-usage.js";
import requireContainerTypeForNamedContainersRule from "../rules/require-container-type-for-named-containers.js";
import requireNamedContainerRule from "../rules/require-named-container.js";
/* eslint-enable import-x/max-dependencies -- Dependency fan-in ends after the public rule imports. */

/** Public rule registry keyed by unqualified rule name. */
const createRulesRegistry = (): Readonly<
    Record<string, StylelintPluginRuleContract>
> => ({
    "no-block-axis-query-on-inline-size-container":
        noBlockAxisQueryOnInlineSizeContainerRule,
    "no-conflicting-container-name-declarations":
        noConflictingContainerNameDeclarationsRule,
    "no-degenerate-container-query-conditions":
        noDegenerateContainerQueryConditionsRule,
    "no-invalid-container-query-ranges": noInvalidContainerQueryRangesRule,
    "no-scroll-state-query-on-non-scroll-state-container":
        noScrollStateQueryOnNonScrollStateContainerRule,
    "no-size-query-on-non-size-container": noSizeQueryOnNonSizeContainerRule,
    "no-unknown-container-names": noUnknownContainerNamesRule,
    "no-unreachable-container-intervals": noUnreachableContainerIntervalsRule,
    "prefer-logical-size-features": preferLogicalSizeFeaturesRule,
    "prefer-range-syntax": preferRangeSyntaxRule,
    "require-breakpoint-token-usage": requireBreakpointTokenUsageRule,
    "require-container-type-for-named-containers":
        requireContainerTypeForNamedContainersRule,
    "require-named-container": requireNamedContainerRule,
});

/** Public rule registry keyed by unqualified rule name. */
export const containerQuerySanityRules: Readonly<
    Record<string, StylelintPluginRuleContract>
> = createRulesRegistry();

/** Public rule registry type. */
export type ContainerQuerySanityRulesRegistry =
    typeof containerQuerySanityRules;
