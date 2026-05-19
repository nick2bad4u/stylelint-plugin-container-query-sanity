/**
 * @packageDocumentation
 * Rule enforcing explicit named container queries.
 */
import type { Root } from "postcss";

import stylelint, { type PostcssResult } from "stylelint";
import { isDefined } from "ts-extras";

import {
    isValidContainerName,
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

const ruleName = createRuleName("require-named-container");

const invalidContainerNameMessage = (containerName: string): string =>
    `Container query name "${containerName}" is not a valid <custom-ident>.`;

const messages = stylelint.utils.ruleMessages(ruleName, {
    invalidContainerName: invalidContainerNameMessage,
    missingContainerName:
        "Container queries must target a named container instead of the anonymous nearest container.",
});

const docs = {
    description:
        "Require every @container rule to target an explicit, valid container name.",
    recommended: true,
    url: createRuleDocsUrl("require-named-container"),
} as const;

const rule =
    (primary: boolean) =>
    (root: Readonly<Root>, result: Readonly<PostcssResult>) => {
        const validOptions = validateOptions(result, ruleName, {
            actual: primary,
            possible: [true],
        });

        if (!validOptions) {
            return;
        }

        root.walkAtRules("container", (atRule) => {
            const parsed = parseContainerQueryParams(atRule.params);
            const containerName = parsed.containerName;

            if (!isDefined(containerName)) {
                report({
                    message: messages.missingContainerName,
                    node: atRule,
                    result,
                    ruleName,
                });
                return;
            }

            if (!isValidContainerName(containerName)) {
                report({
                    message: messages.invalidContainerName(containerName),
                    node: atRule,
                    result,
                    ruleName,
                });
            }
        });
    };

/** Require explicit, valid names for container query targets. */
const requireNamedContainerRule: StylelintPluginRuleContract =
    createStylelintRule({
        docs,
        messages,
        meta: {
            url: docs.url,
        },
        rule,
        ruleName,
    });

export default requireNamedContainerRule;
