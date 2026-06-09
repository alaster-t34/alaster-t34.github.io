# Alastor-t34 Anime Tech Blog

An Astro-powered personal blog customized from Fuwari into a cleaner anime-game style interface.

The site focuses on AI, Live2D, desktop-pet experiments, frontend notes, Linux notes, and personal technical writing.

## Features

- Anime-game inspired glass UI with cyan/pink HUD accents
- Large responsive banner artwork with tuned visual-only banner sizing
- Astro static generation with Tailwind CSS styling
- Light / dark mode and theme color controls
- Post archive, category, tag, RSS, and Pagefind search support
- Markdown posts with cover images, reading metadata, and responsive layouts

## Project Structure

```text
src/config.ts                 Site title, navigation, banner, profile, favicon
src/constants/banner.ts       Visual banner height overrides for this customized theme
src/styles/anime-game.css     Anime-game UI overrides loaded after the base theme
src/content/posts/            Blog posts and post-local assets
src/content/spec/about.md     About page content
public/favicon/               Favicons served from the public directory
```

## Getting Started

```bash
pnpm install
pnpm dev
```

Build the production site:

```bash
pnpm build
```

Create a new post:

```bash
pnpm new-post <filename>
```

## Post Frontmatter

```yaml
---
title: My First Blog Post
published: 2026-01-01
description: Short description for cards and metadata.
image: ./cover.jpg
tags: [AI, Live2D]
category: Research
draft: false
lang: zh_CN
---
```

## Customization Notes

- Change global site information in `src/config.ts`.
- Adjust banner height in `src/constants/banner.ts` without touching upstream theme defaults.
- Tune the anime-game visual layer in `src/styles/anime-game.css`.
- Place post images beside each post and reference them with relative paths.

## Credits

This site is based on the Astro blog theme Fuwari and customized for Alastor-t34's anime/AI style.
