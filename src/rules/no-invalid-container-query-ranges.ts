/**
 * @packageDocumentation
 * Rule validating contradictory or mixed-unit container query intervals.
 */
import stylelint from "stylelint";
import { arrayJoin, isDefined, isEmpty } from "ts-extras";

import {
    collectFeatureConstraints,
    groupConstraintsByFeatureAndUnit,
    isIntervalEmpty,
    normalizeInterval,
    parseContainerQueryParams,
} from "../_internal/container-query-analysis.js";
import {
    createStylelintRule,
    type StylelintPluginRuleContract,
} from "../_internal/create-stylelint-rule.js";
import {
    createRuleDocsUrl,
    createRuleName,
} from "../_internal/plugin-constants.js";

const { report, validateOptions } = stylelint.utils;

const ruleName = createRuleName("no-invalid-container-query-ranges");

const mixedUnitsMessage = (feature: string, units: string): string =>
    `Container query range for "${feature}" mixes units (${units}). Use one unit family per range expression.`;
const unreachableRangeMessage = (
    feature: string,
    lower: string,
    upper: string
): string =>
    `Container query range for "${feature}" is empty (${lower} to ${upper}).`;

const messages = stylelint.utils.ruleMessages(ruleName, {
    mixedUnits: mixedUnitsMessage,
    unreachableRange: unreachableRangeMessage,
});

const docs = {
    description:
        "Disallow contradictory or mixed-unit ranges in container size queries.",
    recommended: true,
    url: createRuleDocsUrl("no-invalid-container-query-ranges"),
} as const;

const formatBound = (bound: {
    inclusive: boolean;
    unit: string;
    value: number;
}): string =>
    `${bound.inclusive ? "[" : "("}${String(bound.value)}${bound.unit}`;

const sortLexicographically = (
    values: readonly string[]
): readonly string[] => {
    const sortedValues: string[] = [];

    for (const value of values) {
        let insertionOffset = sortedValues.length;

        for (const [index, sortedValue] of sortedValues.entries()) {
            if (value.localeCompare(sortedValue) < 0) {
                insertionOffset = index;
                break;
            }
        }

        sortedValues.splice(insertionOffset, 0, value);
    }

    return sortedValues;
};

const rule =
    (primary: boolean) =>
    (
        root: import("postcss").Root,
        result: import("stylelint").PostcssResult
    ) => {
        const validOptions = validateOptions(result, ruleName, {
            actual: primary,
            possible: [true],
        });

        if (!validOptions) {
            return;
        }

        root.walkAtRules("container", (atRule) => {
            const { condition } = parseContainerQueryParams(atRule.params);
            const constraints = collectFeatureConstraints(condition);

            if (isEmpty(constraints)) {
                return;
            }

            const grouped = groupConstraintsByFeatureAndUnit(constraints);

            for (const [feature, byUnit] of grouped) {
                const unitKeys = sortLexicographically([...byUnit.keys()]);

                if (unitKeys.length > 1) {
                    report({
                        message: messages.mixedUnits(
                            feature,
                            arrayJoin(unitKeys, ", ")
                        ),
                        node: atRule,
                        result,
                        ruleName,
                    });
                }

                for (const unit of unitKeys) {
                    const sameUnitConstraints = byUnit.get(unit);

                    if (isDefined(sameUnitConstraints)) {
                        const interval = normalizeInterval(sameUnitConstraints);
                        const lower = interval.lower;
                        const upper = interval.upper;

                        if (
                            isIntervalEmpty(interval) &&
                            isDefined(lower) &&
                            isDefined(upper)
                        ) {
                            report({
                                message: messages.unreachableRange(
                                    feature,
                                    formatBound(lower),
                                    `${formatBound(upper)}]`
                                ),
                                node: atRule,
                                result,
                                ruleName,
                            });
                        }
                    }
                }
            }
        });
    };

const noInvalidContainerQueryRangesRule: StylelintPluginRuleContract =
    createStylelintRule({
        docs,
        messages,
        meta: {
            url: docs.url,
        },
        rule,
        ruleName,
    });

export default noInvalidContainerQueryRangesRule;
