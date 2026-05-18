# no-block-axis-query-on-inline-size-container

Disallow block-axis size features in queries targeting containers declared with `container-type: inline-size`.

## Why

`inline-size` containers expose inline-axis size containment. Queries for `block-size`, `height`, `aspect-ratio`, or `orientation` need `container-type: size`.

## ❌ Incorrect

```css
.card-list {
 container: cards / inline-size;
}

@container cards (block-size >= 30rem) {
 .card {
  display: grid;
 }
}
```

## ✅ Correct

```css
.card-list {
 container: cards / size;
}

@container cards (block-size >= 30rem) {
 .card {
  display: grid;
 }
}
```
