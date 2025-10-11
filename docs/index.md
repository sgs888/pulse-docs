---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Note"
  text: "my note"
  tagline: ✨My great project tagline
  image:
    src: /logo.png
    alt: VitePress
  actions:
    - theme: brand
      text: 开始阅读
      link: /front/dart
    - theme: alt
      text: 更新记录
      link: /O&M/linux

features:
  - title: 📚 技术笔记
    details: 记录前端、Node.js、Vue 等技术学习过程
  - title: 🧠 学习方法
    details: 高效学习、时间管理、知识体系搭建
  - title: 🌱 生活随笔
    details: 阅读感悟、生活记录、成长反思

tk:
  features:
    - title: 快速开发
      details: 提供了完整版参考代码和精简版开发代码
      image: /feature/ui.svg
      highlights:
        - title: 从零安装：运行 <code>pnpm add vitepress-theme-teek vitepress</code> 以从 NPM 下载 Teek 主题。
        - title: 现有模板：运行 <code>git clone https://github.com/Kele-Bingtang/vitepress-theme-teek-docs-template.git</code> 以下载当前文档模板。

    - title: 拥有丰富的 Features，并持续更新
      details: 满足大部分开发场景。
      image: /feature/features.svg
      features:
        - title: 最新流行稳定技术栈
          icon: icon-github
          details: 基于 Vue3.2、TypeScript、Vite4、Pinia、Element-Plus 等最新技术栈开发
          link: /guide/intro

        - title: 简单上手 & 学习
          icon: <svg viewBox="0 0 24 24" width="1.2em" height="1.2em"><path fill="currentColor" d="m23 12l-7.071 7.071l-1.414-1.414L20.172 12l-5.657-5.657l1.414-1.414L23 12zM3.828 12l5.657 5.657l-1.414 1.414L1 12l7.071-7.071l1.414 1.414L3.828 12z"></path></svg>
          details: 项目结构清晰，代码简单、易读。

        - title: 规范工程化工作流
          icon: /teek-logo-mini.svg
          details: 配置 Eslint、Prettier、Husky、Commitlint、Lint-staged 规范前端工程代码规范。

        - title: 完善的打包优化方案
          icon: icon-github
          details: 内置规范的打包目录，提供打包压缩功能，减少打包体积。

        - title: 丰富的组件
          icon: /teek-logo-mini.svg
          details: 提供丰富的通用组件、业务组件。
          link: /ecosystem/components

        - title: 常用 Hook 函数
          icon: icon-gitee
          details: 提供丰富的组件、常用 Hooks 封装，实现复用思想，减少重复开发，提高效率。

        - title: 个性化主题配置
          icon: icon-xiangce
          details: 提供主题颜色配置，暗黑、灰色、色弱等模式切换。
          link: /guide/theme-enhance

        - title: 多种布局配置
          icon: /teek-logo-mini.svg
          details: 提供多种布局、标签栏切换，布局显隐，满足大部分场景。

        - title: 项目权限管控
          icon: /teek-logo-mini.svg
          details: 采用 RBAC 权限管控，提供菜单、路由及按钮粗细粒度权限管理方案

        - title: 国际化
          icon: /teek-logo-mini.svg
          details: 内置常用国际化转换函数，支持自定义国际化切换，

        - title: IFrame 嵌入
          icon: /teek-logo-mini.svg
          details: 提供 IFrame 嵌入、缓存功能，支持门户 Portal 布局。

        - title: 自定义指令
          icon: /teek-logo-mini.svg
          details: 内置多种 Vue 自定义指令，提供傻瓜式指令一键注册功能。

        - title: Axios 封装
          icon: /teek-logo-mini.svg
          details: 基于 Axios 封装常用请求模块，内置业务拦截器、异常拦截器。

        - title: 多种图标类型
          icon: /teek-logo-mini.svg
          details: 支持 IconFont、SVG、Iconify 等多种图标类型渲染。
          link: /guide/icon-use
---
