# no-conflicting-container-name-declarations

Disallow reusing the same container name with conflicting static `container-type` declarations.

## Why

Container names become contracts between the container declaration and every `@container` rule that targets that name. Reusing one name for different type contracts makes query behavior depend on selector context and is difficult to review safely.

## ❌ Incorrect

```css
.layout {
 container: shell / inline-size;
}

.dialog {
 container: shell / size;
}
```

## ✅ Correct

```css
.layout {
 container: shell / inline-size;
}

.dialog {
 container: dialog / size;
}
```
