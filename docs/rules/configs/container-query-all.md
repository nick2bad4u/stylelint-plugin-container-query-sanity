# container-query-all

Full public rule catalog for `container-query-sanity/*`.

Includes recommended rules plus non-recommended strictness checks.

## Rules in this config

**Fix legend:** 🔧 = autofixable · — = report only

| Rule | Fix | Description |
| --- | :-: | --- |
| [`no-block-axis-query-on-inline-size-container`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/no-block-axis-query-on-inline-size-container) | — | Disallow block-axis size features in queries targeting inline-size-only containers. |
| [`no-conflicting-container-name-declarations`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/no-conflicting-container-name-declarations) | — | Disallow reusing the same container name with conflicting static container-type declarations. |
| [`no-degenerate-container-query-conditions`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/no-degenerate-container-query-conditions) | — | Disallow redundant lower bounds that are always true for non-negative container sizes. |
| [`no-invalid-container-query-ranges`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/no-invalid-container-query-ranges) | — | Disallow contradictory or mixed-unit ranges in container size queries. |
| [`no-scroll-state-query-on-non-scroll-state-container`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/no-scroll-state-query-on-non-scroll-state-container) | — | Disallow scroll-state() queries that target names not declared with scroll-state containment. |
| [`no-size-query-on-non-size-container`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/no-size-query-on-non-size-container) | — | Disallow size-feature @container queries that target names declared without size-capable container-type values. |
| [`no-unknown-container-names`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/no-unknown-container-names) | — | Disallow @container names that are never declared via container-name/container in the same stylesheet. |
| [`no-unreachable-container-intervals`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/no-unreachable-container-intervals) | — | Disallow nested @container conditions whose intervals cannot overlap with parent container ranges. |
| [`prefer-logical-size-features`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/prefer-logical-size-features) | — | Prefer logical inline-size/block-size features over physical width/height in container queries. |
| [`prefer-range-syntax`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/prefer-range-syntax) | — | Disallow legacy min-/max- container size syntax and require modern range comparison syntax. |
| [`require-breakpoint-token-usage`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/require-breakpoint-token-usage) | — | Require container breakpoints to come from tokenized values instead of hardcoded length literals. |
| [`require-container-type-for-named-containers`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/require-container-type-for-named-containers) | — | Require named containers used by size or scroll-state queries to declare an explicit container-type. |
| [`require-named-container`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/require-named-container) | — | Require every @container rule to target an explicit, valid container name. |
