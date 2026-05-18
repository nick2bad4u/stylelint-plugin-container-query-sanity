# require-container-type-for-named-containers

Require named containers used by size or scroll-state queries to declare an explicit `container-type`.

## Why

`container-name` alone does not opt an element into size or scroll-state containment. A query that targets a named container should make the container contract explicit with `container-type` or the `container` shorthand.

Style queries are intentionally ignored because normal containers can be queried for style.

## ❌ Incorrect

```css
.layout {
 container-name: layout;
}

@container layout (inline-size >= 40rem) {
 .card {
  display: grid;
 }
}
```

## ✅ Correct

```css
.layout {
 container: layout / inline-size;
}

@container layout (inline-size >= 40rem) {
 .card {
  display: grid;
 }
}
```
