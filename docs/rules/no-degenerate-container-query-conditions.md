# no-degenerate-container-query-conditions

Disallow lower bounds that cannot filter any non-negative container size.

## Why

Container sizes are non-negative. Conditions such as `(inline-size >= 0px)` and `(width > -1px)` are effectively always true, so they usually hide a placeholder query or an unfinished breakpoint.

## ❌ Incorrect

```css
@container layout (inline-size >= 0px) {
 .card {
  display: grid;
 }
}
```

## ✅ Correct

```css
@container layout (inline-size >= 40rem) {
 .card {
  display: grid;
 }
}
```
