# 🟡 container-query-recommended

Baseline low-noise preset for container-query sanity.

- Requires named container queries.
- Validates range consistency and empty intervals.

## Rules in this config

**Fix legend:** 🔧 = autofixable · — = report only

| Rule                                                                                                                                                       | Fix | Description                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | -------------------------------------------------------------------------------------------------- |
| [`no-invalid-container-query-ranges`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/no-invalid-container-query-ranges)   |  —  | Disallow contradictory or mixed-unit ranges in container size queries.                             |
| [`no-unreachable-container-intervals`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/no-unreachable-container-intervals) |  —  | Disallow nested @container conditions whose intervals cannot overlap with parent container ranges. |
| [`require-named-container`](https://nick2bad4u.github.io/stylelint-plugin-container-query-sanity/docs/rules/require-named-container)                       |  —  | Require every @container rule to target an explicit, valid container name.                         |

## Related docs

- [Preset matrix](./index.md)
- [🔴 Strict config](./container-query-strict.md)
- [🟣 All config](./container-query-all.md)
