# no-unreachable-container-intervals

Disallow nested `@container` intervals that cannot overlap with their parent interval.

## Why

A nested interval that is disjoint from the parent condition is dead code and signals a logic bug in the breakpoint plan.

## ❌ Incorrect

```css
@container layout (width >= 60rem) {
 @container layout (width < 40rem) {
  .card {
   display: grid;
  }
 }
}
```

## ✅ Correct

```css
@container layout (width >= 60rem) {
 @container layout (width >= 72rem) {
  .card {
   display: grid;
  }
 }
}
```
