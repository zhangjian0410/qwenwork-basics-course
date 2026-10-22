# 千问办公 · 新人培训（基础篇）

原始教材出品：AI经营交付效能专项组。18 页图文课件，配套动手做、选读与自测。

正式入口：https://archer-ai-courses.pages.dev/courses/qwen-office-basics/

## 维护与预览

需要 Node.js 22.16+，无需安装课程依赖。

```sh
npm run build
npm run check
```

用任意本地静态服务器预览 dist/。

- src/course.json：元信息、资料菜单和后续路线。
- src/content.json：同事提供的课件文字与跟练内容。
- src/downloads/：同事提供的 PPTX、PDF，保留原件。
- src/assets/slides/：由该 PDF 渲染的 18 张 16:9 WebP；manifest.json 固定 PDF 与图片摘要，构建拒绝不同步的预览。
- scripts/build-web.mjs：生成全部网页，桌面使用 PDF 预览，手机及文字版使用可阅读 HTML；末页保留讲解。

修改课件内容时，同时更新 PPT/PDF、预览和网页文字，核对三者的一致性。预览需由完整 PDF 按顺序渲染为 1600×900 WebP，并更新 manifest；不要只修改摘要跳过渲染。

## 发布

本仓库 Actions 负责构建与链接检查，不持有 Cloudflare 密钥。正式站点由公开仓库 zhangjian0410/ai-training-portal 的 src/courses.json 登记并组装，沿用现有 Cloudflare Pages 项目 archer-ai-courses。更新本课时先检查并打新版本 tag，再更新 Portal 中本课 ref；推送 Portal main 自动构建发布。不另建数据库、计费项目或课程域名。

学习路线统一为看课件→动手做；深入阅读与自测在学习资料。留言、回复、点赞和统计由 Portal 同源后台提供，独立静态预览不提供后台服务。

## 使用范围

教材可公开阅读，练习需要学员自己的千问办公账号。企业 IM、数据源、技能、定时等功能以实际版本、套餐与授权为准。平台入口与官方帮助已核对，本次网站接入不等于所有产品功能均已实操验证。
