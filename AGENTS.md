# AGENTS.md

Welcome! This guide helps AI agents (Cursor, Gemini, Claude, etc.) understand the architecture, technologies, data schemas, and development guidelines of the **djspot-fe** project.

---

## 1. Project Overview
- **Goal:** Application for sharing DJs, their profiles, and music.
- **Frontend App:** Connects to a backend running **Directus CMS** using the `@directus/sdk`.
- **Communication Protocol:** REST API and WebSockets (via a local server-side websocket handler).

---

## 2. Technology Stack

- **Framework:** [Nuxt v4](https://nuxt.com/) (using the modern folder structure with everything housed in the `app/` directory).
- **UI Library:** [Nuxt UI v4](https://ui.nuxt.com/) (provides accessible UI elements like `UButton`, `UForm`, etc.).
- **Backend SDK:** `@directus/sdk` (v20+) for all REST requests, authentication, and real-time subscription.
- **Form Validation:** [Zod](https://zod.dev/) for client-side and form schema validation.
- **State Management:** [Pinia](https://pinia.vuejs.org/) with `pinia-plugin-persistedstate` (stores in `app/stores/`).
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (defined via `@import "tailwindcss"` in `app/assets/css/main.css`).
- **Localization:** `@nuxtjs/i18n` (CS/EN support, with CS/Czech as default. Configured with `no_prefix` URL strategy).

---

## 3. Directory Layout (Nuxt 4 structure)

All frontend application code lives inside the `/app` folder:
- **`app/pages/`**: Page views and routing.
  - `/djs/` (DJ listing, profiles, and management)
  - `/sounds/` (Tracks and mixes)
  - `/user/` (Authentication, account settings)
- **`app/components/`**: Reusable UI components.
  - `/dj/`, `/sound/`, `/form/`, `/layout/`, etc.
- **`app/stores/`**: Pinia state management (e.g., `user.ts`, `player.ts`, `playlist.ts`).
- **`app/plugins/`**: Nuxt plugins.
  - `/directus/`: Directus SDK setup. Includes custom cookie storage, token refresh, and automatic error interception/retries.
- **`app/assets/css/`**: Global styles (`main.css` containing Tailwind CSS imports and custom font themes).
- **`server/`**: Nuxt server-side directory.
  - `routes/websocket.ts`: CrossWS server websocket handler proxying clients to the Directus WS server.
- **`i18n/`**: Locale files (`i18n/locales/cs.json` and `i18n/locales/en.json`).

---

## 4. Directus SDK Integration

The app configures a type-safe `@directus/sdk` client within `app/plugins/directus/index.ts`. 

- **Accessing Directus:** Provided globally as `$directus`. Retrieve it via `useNuxtApp().$directus`.
- **Real-time / WebSockets:** WebSocket connections are routed locally through `/websocket` (defined in `server/routes/websocket.ts`), which proxies incoming traffic to the Directus CMS WebSocket endpoint (`http://localhost:8055/websocket`).
- **Authentication:** Relies on local cookie storage (`useCookie('directus-data')`). Automatically handles refreshing expired tokens via a Proxy wrapper around `directus.request`.

---

## 5. Key Schemas & Collections

Types and interface definitions generated from the Directus CMS schema reside in `app/plugins/directus/types.ts`.

Key interfaces to know:
- **`Dj`**: DJ profile (name, bio, slug, city, genres, photo, follows, sounds, follow_count).
- **`Sound`**: Audio upload (track/mix, duration, dj, genres, likes, url, slug, like_count).
- **`Genre`**: Music genre tag.
- **`City`**: Geographical reference (name, GPS coordinates as `GeoPoint`).
- **`DirectusUser`**: The authentication user object containing a reference to their `djs[]`.

### Directus Fieldsets
To query API endpoints cleanly with only necessary fields, use the defined fieldsets inside `app/plugins/directus/collection/`:
- `djFieldSets.default` / `djFieldSets.withSounds` / `djFieldSets.form`
- `soundFieldSets.default` / `soundFieldSets.form`

---

## 6. Coding Guidelines & Best Practices for Agents

1. **Nuxt 4 Conventions:**
   - Keep page views in `app/pages/` and reusable UI logic in `app/components/`.
   - Leverage Nuxt auto-imports for Vue Composables, Pinia stores, and components.
   - Use `<script setup lang="ts">` for all new components.

2. **Localization (i18n):**
   - **Never hardcode user-facing strings.**
   - Add new translations in `i18n/locales/cs.json` and `i18n/locales/en.json`.
   - Use `$i18n.t('key')` in template markup and `const { $i18n } = useNuxtApp()` / `$i18n.t('key')` inside scripts.

3. **Styling & UI:**
   - Use **Nuxt UI** components (`UButton`, `UForm`, `UInput`, `UCard`) configured with standard colors.
   - Use **Tailwind CSS v4** classes directly for layout and styling tweaks.
   - Refrain from writing inline CSS styles unless dynamically required.

4. **Form Handling:**
   - Validate form submissions using **Zod** schemas in combination with Nuxt UI's `<UForm :schema="..." :state="...">` component.

---

## 7. Command Reference

- **Install dependencies:** `npm install`
- **Start dev server (HTTP):** `npm run dev` (starts on `http://127.0.0.1:3000`)
- **Start dev server (HTTPS + custom SSL):** `npm run dev-https`
- **Build application:** `npm run build`
- **Run linter:** `npm run lint`
