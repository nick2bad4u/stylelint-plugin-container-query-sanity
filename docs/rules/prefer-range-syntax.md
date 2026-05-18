# prefer-range-syntax

Require modern range comparison syntax for container size queries.

## Why

Legacy query fragments like `(min-width: 40rem)` and `(max-inline-size: 70ch)` are valid, but modern range syntax is clearer and easier to combine with interval analysis:

- `(width >= 40rem)`
- `(inline-size <= 70ch)`

Using one syntax style across the codebase also improves readability and review consistency.

## ❌ Incorrect

```css
@container card (min-width: 40rem) {
 .card {
  grid-template-columns: 1fr 1fr;
 }
}

@container shell (max-inline-size: 75ch) and (min-block-size: 20rem) {
 .summary {
  display: none;
 }
}
```

## ✅ Correct

```css
@container card (width >= 40rem) {
 .card {
  grid-template-columns: 1fr 1fr;
 }
}

@container shell (inline-size <= 75ch) and (block-size >= 20rem) {
 .summary {
  display: none;
 }
}
```
