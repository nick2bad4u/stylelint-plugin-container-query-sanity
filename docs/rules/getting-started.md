---
title: Getting Started
description: Install and use stylelint-plugin-container-query-sanity in an ESM Stylelint config.
---

# Getting Started

## Installation

```sh
npm install --save-dev stylelint stylelint-plugin-container-query-sanity
```

## Quick start with a shareable config

```js
import { containerQuerySanityPluginConfigs } from "stylelint-plugin-container-query-sanity";

export default containerQuerySanityPluginConfigs["container-query-recommended"];
```

## Quick start with `extends`

```js
export default {
 extends: [
  "stylelint-config-standard",
  "stylelint-plugin-container-query-sanity/configs/container-query-recommended",
 ],
};
```

## Manual plugin registration

```js
export default {
 plugins: ["stylelint-plugin-container-query-sanity"],
 rules: {
  "container-query-sanity/require-named-container": true,
 },
};
```

## Next steps

- [Compare recommended, strict, and all configs](./configs/index.md)
- [Read the plugin overview](./overview.md)
- [Check the current implementation status](./guides/current-status.md)
