# require-named-container

Require every `@container` rule to target an explicit named container.

## Why

Anonymous container queries can silently match unexpected ancestors. Naming the container makes intent explicit and improves maintainability.

## ❌ Incorrect

```css
@container (width > 48rem) {
 .card {
  grid-template-columns: 1fr 1fr;
 }
}
```

## ✅ Correct

```css
@container layout (width > 48rem) {
 .card {
  grid-template-columns: 1fr 1fr;
 }
}
```
