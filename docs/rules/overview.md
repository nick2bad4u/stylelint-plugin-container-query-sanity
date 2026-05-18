---
title: Overview
description: Overview of stylelint-plugin-container-query-sanity and its package surface.
---

# stylelint-plugin-container-query-sanity

`stylelint-plugin-container-query-sanity` is a Stylelint plugin focused on safe container-query authoring:

- enforce named container targeting
- catch unknown container-name references
- catch size queries targeting non-size container declarations
- catch contradictory and unreachable intervals
- enforce modern range comparison syntax over legacy `min-*` / `max-*` syntax
- discourage hardcoded breakpoint literals

The repository keeps the full template infrastructure (sync scripts, docs site, validation flows), but the public rule surface is now dedicated to container-query sanity.
