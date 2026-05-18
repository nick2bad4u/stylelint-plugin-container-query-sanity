# container-query-all

Full public rule catalog for `container-query-sanity/*`.

Includes recommended rules plus non-recommended strictness checks.

## Rules in this config

**Fix legend:** 🔧 = autofixable · — = report only

| Rule | Fix | Description |
| --- | :-: | --- |
| [`no-invalid-container-query-ranges`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/no-invalid-container-query-ranges) | — | Disallow contradictory or mixed-unit ranges in container size queries. |
| [`no-size-query-on-non-size-container`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/no-size-query-on-non-size-container) | — | Disallow size-feature @container queries that target names declared without size-capable container-type values. |
| [`no-unknown-container-names`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/no-unknown-container-names) | — | Disallow @container names that are never declared via container-name/container in the same stylesheet. |
| [`no-unreachable-container-intervals`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/no-unreachable-container-intervals) | — | Disallow nested @container conditions whose intervals cannot overlap with parent container ranges. |
| [`prefer-range-syntax`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/prefer-range-syntax) | — | Disallow legacy min-/max- container size syntax and require modern range comparison syntax. |
| [`require-breakpoint-token-usage`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/require-breakpoint-token-usage) | — | Require container breakpoints to come from tokenized values instead of hardcoded length literals. |
| [`require-named-container`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/require-named-container) | — | Require every @container rule to target an explicit, valid container name. |
