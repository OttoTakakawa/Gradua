# Within · 协作同行 — 作品展示网站

## 项目概述

本网站是 VR 互动作品 **Within（协作同行）** 的项目官网原型。

从主视觉海报中提取视觉语言（Low-Poly、几何切面、冰蓝/暖米/紫灰配色、轻雾感留白），做成一个可交互、可展示、可继续编辑的作品展示网站。

---

## 文件结构

```
GraduateWeb/
├── index.html                  ← 首页（入口页面）
├── images/
│   └── 剪贴板图片.jpg           ← 主视觉海报（共用素材）
├── about/
│   └── index.html              ← 项目介绍
├── chapters/
│   └── index.html              ← 章节导览（核心页面）
├── process/
│   ├── index.html              ← 制作过程
│   └── videos/
│       └── within-process.mp4  ← 本地视频
├── thanks/
│   └── index.html              ← 感谢页
└── README.md                   ← 本说明文档
```

每个 HTML 页面都在自己的文件夹中，方便独立管理素材。

---

## 各页面说明

| 页面 | 访问路径 | 内容 |
|------|---------|------|
| **首页** | `index.html` | 纯氛围开场，大标题 + 主海报 + 进入按钮 |
| **项目介绍** | `about/index.html` | 作品简介、核心主题、体验关键词、项目亮点 |
| **章节导览** | `chapters/index.html` | 可点击海报 + 四个章节详情（第一章~第四章） |
| **制作过程** | `process/index.html` | 制作步骤 + 本地视频播放器 + 过程图片区 |
| **感谢页** | `thanks/index.html` | 鸣谢 + 尾页语句 |

---

## 快速修改指南

### 1. 修改文字内容

用文本编辑器（VS Code、记事本等）打开对应 HTML 文件，**直接搜索中文关键词**即可找到需要修改的文字。

例如：
- 改首页标题 → 打开 `index.html`，搜索 "Within" 或 "协作同行"
- 改章节简介 → 打开 `chapters/index.html`，搜索对应章节名称

### 2. 替换图片

**主海报（多个页面共用）：**
- 文件位置：`images/剪贴板图片.jpg`
- 建议：用自己的海报替换此文件，或修改各 HTML 中的 `src` 路径

**各章节配图：**
- 打开 `chapters/index.html`
- 搜索 "这里改第一章图片"，修改对应的 `<img src="...">`
- 建议：把章节图片放到 `chapters/images/` 文件夹下，例如：
  ```html
  <img src="images/chapter1.jpg" alt="第一章" />
  ```

**制作过程图片：**
- 打开 `process/index.html`
- 搜索 "这里改制作过程图片"
- 建议：放到 `process/images/` 文件夹下

### 3. 替换视频

- 视频文件位置：`process/videos/within-process.mp4`
- 直接替换此文件即可
- 如需修改文件名或路径，打开 `process/index.html`，搜索 `src="videos/`，修改 `<source>` 标签

### 4. 调整海报热区（章节导览页面）

打开 `chapters/index.html`，搜索 "这里改热区形状"。

四个热区的 CSS 如下：

```css
/* 第一章：孤独的城市 —— 左上冰蓝碎片 */
.shape-1 {
  left: 4%; top: 20%;
  width: 36%; height: 32%;
  clip-path: polygon(22% 0, 100% 8%, 86% 100%, 0 74%, 10% 34%);
}

/* 第二章：萨沙的家 —— 右上暖米碎片 */
.shape-2 {
  right: 5%; top: 20%;
  width: 35%; height: 30%;
  clip-path: polygon(12% 4%, 100% 18%, 82% 100%, 6% 80%, 0 24%);
}

/* 第三章：皮埃尔的梦想 —— 左下紫灰碎片 */
.shape-3 {
  left: 8%; top: 54%;
  width: 36%; height: 30%;
  clip-path: polygon(0 16%, 84% 0, 100% 84%, 24% 100%, 6% 66%);
}

/* 第四章：太空之梦 —— 右下蓝青碎片 */
.shape-4 {
  right: 6%; top: 52%;
  width: 34%; height: 32%;
  clip-path: polygon(16% 0, 100% 20%, 82% 100%, 0 78%, 4% 24%);
}
```

**调试技巧：**
1. 用浏览器打开 `chapters/index.html`
2. 按 `F12` 打开开发者工具
3. 选中对应热区元素（`.shape-1` ~ `.shape-4`）
4. 在 Styles 面板里实时修改 `left / top / width / height / clip-path`
5. 满意后将数值复制回代码中

---

## 技术说明

- **纯 HTML + CSS + 原生 JavaScript**，无框架、无构建流程
- 每个页面是独立的 HTML 文件，内嵌完整 CSS，可直接双击打开
- 页面间通过相对路径跳转
- 配色统一使用 CSS 变量，修改一处即可全局生效
- 大量使用中文注释，便于后续自行编辑

---

## 配色参考（从海报提取）

| 色彩 | 用途 | 色值 |
|------|------|------|
| 冰蓝 | 主体冷色、强调 | `#8ab4c4` |
| 灰蓝 | 标题、次要文字 | `#6b8fa3` |
| 深蓝 | 大标题 | `#5a7a8c` |
| 暖米 | 辅助暖色、第二章 | `#d4c4a8` |
| 紫灰 | 点缀、第三章 | `#a898b8` |
| 背景 | 页面底色 | `#f5f7fa` |

---

## 后续可扩展

- 为每个章节单独制作更多概念图/截图，替换现有占位图
- 为视频添加专门的封面图（修改 `<video poster="...">`）
- 在 `process/images/` 中放更多过程照片
- 在 `thanks/index.html` 中添加二维码或联系方式
- 如需调整热区，使用浏览器的开发者工具实时调试

---

**最后更新：** 2026年5月
