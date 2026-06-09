# Alastor-t34 动漫科技博客

这是一个基于 Astro 的个人博客，由 Fuwari 主题定制为更偏“二次元游戏界面”的视觉风格。

站点内容主要用于记录 AI、Live2D、AI 桌宠、前端、Linux 以及个人技术实验。

## 功能特性

- 粉蓝霓虹 + 玻璃拟态 + HUD 装饰的二次元游戏界面风格
- 响应式大横幅背景图，并通过独立常量控制视觉高度
- 基于 Astro 静态生成，使用 Tailwind CSS 组织样式
- 支持亮色 / 暗色模式和主题色切换
- 支持文章归档、分类、标签、RSS 和 Pagefind 搜索
- Markdown 写作，支持封面图、阅读时间、文章元信息和响应式布局

## 项目结构

```text
src/config.ts                 站点标题、导航、横幅、个人信息、图标等配置
src/constants/banner.ts       当前主题专用的横幅视觉高度配置
src/styles/anime-game.css     二次元游戏界面视觉覆盖样式
src/content/posts/            博客文章和文章局部资源
src/content/spec/about.md     关于页面内容
public/favicon/               站点图标
```

## 本地开发

```bash
pnpm install
pnpm dev
```

构建生产版本：

```bash
pnpm build
```

创建新文章：

```bash
pnpm new-post <filename>
```

## 文章 Frontmatter

```yaml
---
title: 我的第一篇文章
published: 2026-01-01
description: 用于文章卡片和元信息的简短描述。
image: ./cover.jpg
tags: [AI, Live2D]
category: Research
draft: false
lang: zh_CN
---
```

## 自定义说明

- 站点基础信息在 `src/config.ts` 中修改。
- 横幅高度在 `src/constants/banner.ts` 中调整，避免直接改动上游主题默认常量。
- 二次元游戏界面的视觉效果集中在 `src/styles/anime-game.css` 中调整。
- 文章图片建议放在文章同级目录，并使用相对路径引用。

## Credits

本站基于 Astro 博客主题 Fuwari 定制，并针对 Alastor-t34 的动漫 / AI 内容方向进行了视觉改造。
