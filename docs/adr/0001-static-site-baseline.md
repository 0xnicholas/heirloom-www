# 静态站技术选型与视觉基线

官网用 Astro 静态输出、无 JS 框架岛屿、无分析追踪（GA/Plausible/Umami 均不做）；产物为纯 HTML + CSS，唯一的客户端脚本例外是构建时高亮（Shiki，零运行时）。视觉基线：系统字体双栈（无衬线正文 + 等宽点缀，不换 webfont 就不动组件）、浅底 `#fcfcfa` + 墨色 `#1b1b18` + 单一强调色 `#4f46e5`，全部以 CSS 变量落在 `src/styles/global.css` 顶部。

方向在地图 [#1](https://github.com/0xnicholas/heirloom-www/issues/1) Notes 中预定（理由：页面无交互需求、无外部依赖、无追踪），工程化于 [#4](https://github.com/0xnicholas/heirloom-www/issues/4)。托管与域名接入被明确推迟，不阻塞开发。
