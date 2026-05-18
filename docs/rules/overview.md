---
title: Overview
description: Overview of stylelint-plugin-container-query-sanity and its package surface.
---

# stylelint-plugin-container-query-sanity

`stylelint-plugin-container-query-sanity` is a Stylelint plugin focused on safe container-query authoring:

- enforce named container targeting
- catch unknown container-name references
- catch size queries targeting non-size container declarations
- catch block-axis queries against inline-size-only containers
- catch scroll-state queries targeting non-scroll-state containers
- catch conflicting container-name type contracts
- catch contradictory and unreachable intervals
- catch redundant lower bounds that cannot filter real container sizes
- require explicit container-type declarations for queried named containers
- prefer logical size features for writing-mode-safe component breakpoints
- enforce modern range comparison syntax over legacy `min-*` / `max-*` syntax
- discourage hardcoded breakpoint literals

The repository keeps the full template infrastructure (sync scripts, docs site, validation flows), but the public rule surface is now dedicated to container-query sanity.
