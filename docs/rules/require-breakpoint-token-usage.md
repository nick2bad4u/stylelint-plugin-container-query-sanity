# require-breakpoint-token-usage

Require tokenized breakpoint values in container-query conditions.

## Why

Hardcoded literals drift from design-system breakpoints. Tokenized values (`var(--cq-*)`) keep breakpoints centralized and auditable.

## ❌ Incorrect

```css
@container layout (width > 48rem) {
 .card {
  gap: 2rem;
 }
}
```

## ✅ Correct

```css
@container layout (width > var(--cq-layout-md)) {
 .card {
  gap: 2rem;
 }
}
```
