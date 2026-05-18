# no-scroll-state-query-on-non-scroll-state-container

Disallow `scroll-state()` queries targeting containers not declared with `scroll-state` containment.

## Why

Scroll-state queries only make sense for containers opted into scroll-state containment. Querying a size-only or normal container makes the rule look intentional while the container contract is incomplete.

## ❌ Incorrect

```css
.pane {
 container: pane / inline-size;
}

@container pane scroll-state(stuck: top) {
 .pane-title {
  box-shadow: 0 1px 0 currentColor;
 }
}
```

## ✅ Correct

```css
.pane {
 container: pane / scroll-state;
}

@container pane scroll-state(stuck: top) {
 .pane-title {
  box-shadow: 0 1px 0 currentColor;
 }
}
```
