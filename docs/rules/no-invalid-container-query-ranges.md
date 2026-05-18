# no-invalid-container-query-ranges

Disallow contradictory or mixed-unit intervals in `@container` size conditions.

## Why

Ranges like `width > 60rem and width < 40rem` never match. Mixed units in one interval make intent ambiguous and harder to validate.

## ❌ Incorrect

```css
@container layout (width > 60rem) and (width < 40rem) {
 .card {
  display: grid;
 }
}

@container layout (30rem <= width <= 640px) {
 .card {
  display: grid;
 }
}
```

## ✅ Correct

```css
@container layout (40rem <= width <= 60rem) {
 .card {
  display: grid;
 }
}
```
