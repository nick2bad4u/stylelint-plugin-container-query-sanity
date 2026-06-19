---
title: no-size-query-on-non-size-container
description: Disallow size-feature container queries that target names declared without inline-size/size containment.
---

# no-size-query-on-non-size-container

Ensures named `@container` size queries only target container names with a known size-capable container type (`inline-size` or `size`) in the same stylesheet.

## Why

Container size features like `width`, `inline-size`, and `block-size` require size containment. Querying a name that is only declared with `container-type: normal` or `scroll-state` silently creates dead conditions.

## Rule Options

`true`

Or:

```js
[
 true,
 {
  ignoreNames: ["framework-shell"],
  whenTypeUnknown: "ignore", // or "report"
 },
];
```

- `ignoreNames`: optional name allowlist.
- `whenTypeUnknown`: when `report`, also reports size queries when the rule cannot find a static `container-type` declaration for the target name in the same stylesheet.

## Examples

### Incorrect

```css
.layout {
 container-name: layout;
 container-type: normal;
}

@container layout (width > 40rem) {
 .card {
  display: grid;
 }
}
```

```css
.rail {
 container: rail / scroll-state;
}

@container rail (inline-size > 50rem) {
 .chip {
  display: inline-flex;
 }
}
```

### Correct

```css
.layout {
 container-name: layout;
 container-type: inline-size;
}

@container layout (width > 40rem) {
 .card {
  display: grid;
 }
}
```

```css
.cards {
 container: cards / size;
}

@container cards (inline-size >= 30rem) {
 .card {
  display: grid;
 }
}
```
