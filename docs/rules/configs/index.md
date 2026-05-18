---
title: Configs
description: Shareable Stylelint configs exported by stylelint-plugin-container-query-sanity.
---

# Configs

The package exports three shareable configs for staged adoption:

- [🟡 `container-query-recommended`](./container-query-recommended.md) — low-noise baseline for named containers and impossible ranges.
- [🔴 `container-query-strict`](./container-query-strict.md) — full policy for teams that want explicit containment contracts and tokenized breakpoints.
- [🟣 `container-query-all`](./container-query-all.md) — complete public rule catalog. It currently matches strict because every non-recommended rule is intentionally strict.

Use them from `containerQuerySanityPluginConfigs` or from `extends` subpath exports.

## Preset matrix

**Legend:** ✅ = enabled · — = not enabled

| Rule | 🟡 Recommended | 🔴 Strict | 🟣 All |
| --- | :-: | :-: | :-: |
| [`no-block-axis-query-on-inline-size-container`](../no-block-axis-query-on-inline-size-container.md) | — | ✅ | ✅ |
| [`no-conflicting-container-name-declarations`](../no-conflicting-container-name-declarations.md) | — | ✅ | ✅ |
| [`no-degenerate-container-query-conditions`](../no-degenerate-container-query-conditions.md) | — | ✅ | ✅ |
| [`no-invalid-container-query-ranges`](../no-invalid-container-query-ranges.md) | ✅ | ✅ | ✅ |
| [`no-scroll-state-query-on-non-scroll-state-container`](../no-scroll-state-query-on-non-scroll-state-container.md) | — | ✅ | ✅ |
| [`no-size-query-on-non-size-container`](../no-size-query-on-non-size-container.md) | — | ✅ | ✅ |
| [`no-unknown-container-names`](../no-unknown-container-names.md) | — | ✅ | ✅ |
| [`no-unreachable-container-intervals`](../no-unreachable-container-intervals.md) | ✅ | ✅ | ✅ |
| [`prefer-logical-size-features`](../prefer-logical-size-features.md) | — | ✅ | ✅ |
| [`prefer-range-syntax`](../prefer-range-syntax.md) | — | ✅ | ✅ |
| [`require-breakpoint-token-usage`](../require-breakpoint-token-usage.md) | — | ✅ | ✅ |
| [`require-container-type-for-named-containers`](../require-container-type-for-named-containers.md) | — | ✅ | ✅ |
| [`require-named-container`](../require-named-container.md) | ✅ | ✅ | ✅ |

## Which config should I use?

- Start with [🟡 `container-query-recommended`](./container-query-recommended.md) when introducing the plugin into an existing codebase.
- Move to [🔴 `container-query-strict`](./container-query-strict.md) when every component should declare reliable container contracts and tokenized query thresholds.
- Use [🟣 `container-query-all`](./container-query-all.md) when you want a config that always follows the complete public rule surface.

## Related docs

- [Getting Started](../getting-started.md)
- [Overview](../overview.md)
- [Current Status](../guides/current-status.md)
