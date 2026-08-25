# 托管与域名：GitHub Pages + 默认域名

托管选 GitHub Pages：仓库已托管在 GitHub，静态产物无需任何服务端能力，Actions 推送即部署，零新增账号与外部依赖，与 ADR-0001 的最小依赖方向一致。落选的 Cloudflare Pages / Vercel / Netlify 均要求第三方账号，对一个无交互单页没有对应收益。

域名选 GitHub Pages 默认域名 `0xnicholas.github.io/heirloom-www`：上线阶段不需要自定义域名，"已选定" 的决策就是显式采用默认域名。自定义域名将来若要接入，只需 DNS CNAME + 仓库 Pages 设置 + `astro.config.mjs` 的 `site`/`base` 两处改动，架构无锁定。代价已知：项目页路径要求 `base: '/heirloom-www/'`，页面内静态资产引用必须走 `import.meta.env.BASE_URL`；未来换自定义域名时 OG 绝对 URL 会变，已缓存的分享卡片随之失效重抓。

部署管线：`.github/workflows/deploy.yml`，push 到 `main` 触发 `actions/upload-pages-artifact` + `actions/deploy-pages`。工程化于 [#9](https://github.com/0xnicholas/heirloom-www/issues/9)。
