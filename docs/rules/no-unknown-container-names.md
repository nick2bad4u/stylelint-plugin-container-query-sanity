# no-unknown-container-names

Disallow `@container` names that are never declared via `container-name` or `container` in the same stylesheet.

## Why

Typos in container names silently disable responsive behavior. This rule catches unresolved names early and keeps query targets aligned with declared containers.

## ❌ Incorrect

```css
.layout {
 container-name: layout;
 container-type: inline-size;
}

@container layuot (width > 48rem) {
 .card {
  grid-template-columns: 1fr 1fr;
 }
}
```

## ✅ Correct

```css
.layout {
 container-name: layout;
 container-type: inline-size;
}

@container layout (width > 48rem) {
 .card {
  grid-template-columns: 1fr 1fr;
 }
}
```

## Options

### `ignoreNames`

Allow known external names that are declared outside the current stylesheet:

```js
{
 "container-query-sanity/no-unknown-container-names": [
  true,
  {
   ignoreNames: ["framework-shell"],
  },
 ];
}
```

### `whenNoDeclarations` (default: `"ignore"`)

Controls behavior for files that contain no `container-name`/`container` declarations.

- `"ignore"`: skip reporting unknown names in those files.
- `"report"`: still report unknown names.

Set to `"report"` to enforce strict local declaration requirements:

```js
{
  "container-query-sanity/no-unknown-container-names": [
  true,
  {
   whenNoDeclarations: "report",
  },
 ];
}
```
