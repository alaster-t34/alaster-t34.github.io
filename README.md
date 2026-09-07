# Alastor-t34 Blog

个人博客与技术笔记站点，基于 [Astro](https://astro.build/) 与 [Fuwari](https://github.com/saicaca/fuwari) 构建。

> 再见了，所有的无名之神。

## 🌐 在线访问

- Blog: https://alaster-t34.github.io/
- GitHub: https://github.com/alaster-t34

## ✨ 站点内容

这里主要记录学习、开发与折腾过程中的内容，包括但不限于：

- Artificial Intelligence / Machine Learning
- Linux / Arch Linux
- Software Engineering
- Mathematics & Algorithms
- Research Notes
- Projects & Experiments

## 🧰 技术栈

- [Astro](https://astro.build/)
- [Svelte](https://svelte.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Pagefind](https://pagefind.app/) 全文搜索
- [KaTeX](https://katex.org/) 数学公式渲染
- [PhotoSwipe](https://photoswipe.com/) 图片浏览
- Live2D

## 🚀 本地运行

需要 Node.js 与 pnpm。

```bash
git clone https://github.com/alaster-t34/alaster-t34.github.io.git
cd alaster-t34.github.io
pnpm install
pnpm dev
```

默认开发服务器运行在：

```text
http://localhost:4321
```

生产构建：

```bash
pnpm build
```

本地预览构建结果：

```bash
pnpm preview
```

## ✍️ 新建文章

```bash
pnpm new-post <filename>
```

文章位于：

```text
src/content/posts/
```

站点主要配置位于：

```text
src/config.ts
```

## 📁 常用目录

```text
src/
├── components/        # 页面组件
├── content/posts/     # 博客文章
├── layouts/           # 页面布局
├── pages/             # Astro 页面
└── config.ts          # 站点配置

public/                # 静态资源
scripts/               # 辅助脚本
```

## 🙏 Credits

本站基于 [saicaca/fuwari](https://github.com/saicaca/fuwari) 修改与扩展，感谢原作者及相关开源项目。

## 📄 License

项目代码遵循仓库中的 MIT License。

博客文章内容除特别说明外，采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可。