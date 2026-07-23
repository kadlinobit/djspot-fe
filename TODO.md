# TODO

Follow-ups from the Nuxt 4.5 upgrade.

## High priority

- [ ] **Remove `@unhead/vue` / `unhead` overrides** once `@nuxt/ui` ships unhead v3 support.
  - Currently forced in `package.json` `overrides` because `@nuxt/ui@4.10` still depends on `@unhead/vue@^2`, while Nuxt 4.5 requires v3.
  - Track: [nuxt/ui#6680](https://github.com/nuxt/ui/pull/6680), [nuxt/ui#6642](https://github.com/nuxt/ui/issues/6642)
  - After UI releases a compatible version: bump `@nuxt/ui`, remove the overrides, reinstall, and verify SSR.

## Medium priority

- [x] **Install local Iconify collections** to stop Nuxt Icon runtime fallback warnings:
  ```bash
  npm i -D @iconify-json/lucide @iconify-json/heroicons
  ```
- [x] **Bump `tailwindcss`** to `^4.3.2` (or latest 4.x) to align with `@nuxt/ui`’s `@tailwindcss/vite` / `@tailwindcss/postcss` expectations.

## Low priority / monitor

- [ ] **Watch Nuxt `[NUXT_B2005]` warning** about `check-if-page-unused.js` having no default export. Looks like an upstream Nuxt pages plugin issue; revisit after a Nuxt patch release.
- [ ] **Audit Pinia 4 / `@pinia/nuxt` 1.x usage** in stores (especially `pinia-plugin-persistedstate`) after a full smoke test of login, player, and playlist persistence.
