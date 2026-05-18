# prefer-logical-size-features

Prefer logical size features in container queries.

## Why

`inline-size` and `block-size` follow writing mode. They make component breakpoints safer for internationalized layouts than physical `width` and `height` queries.

## ❌ Incorrect

```css
@container card (width >= 40rem) and (height < 80rem) {
 .card {
  display: grid;
 }
}
```

## ✅ Correct

```css
@container card (inline-size >= 40rem) and (block-size < 80rem) {
 .card {
  display: grid;
 }
}
```
