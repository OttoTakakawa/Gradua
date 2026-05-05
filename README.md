# Within · 协作同行

## 项目概述

本项目是毕业设计作品 **Within（协作同行）** 的静态展示网站，采用纯 `HTML + CSS + JavaScript` 编写，兼容本地 `file://` 直接打开。

当前版本已经拆分为封面首页、项目介绍、问题研究、核心设计、章节导览、四个独立章节页、制作过程与感谢页，并接入连续滚轮翻页逻辑。

## 当前结构

```text
Gradua/
├── index.html                      # 首页封面
├── title.png                       # 首页透明主视觉
├── README.md
├── 启动预览.bat                    # Windows 本地预览启动脚本
├── 启动预览.command                # macOS 本地预览启动脚本
├── Log/
│   ├── 2026-05-04.md               # 早期按日归档记录
│   ├── 2026-05-05.md               # 当日修改记录
│   └── 预览启动日志.md             # 本地预览启动日志
├── images/
│   ├── style-realistic.png
│   ├── style-pixel.png
│   ├── style-lowpoly.png
│   └── 剪贴板图片.jpg
├── about/
│   └── index.html                  # 项目介绍
├── research/
│   └── index.html                  # 问题研究
├── design/
│   └── index.html                  # 核心设计
├── chapters/
│   ├── index.html                  # 章节导览
│   ├── chapter-1/
│   │   ├── index.html
│   │   ├── images/
│   │   └── videos/
│   ├── chapter-2/
│   │   ├── index.html
│   │   ├── images/
│   │   └── videos/
│   ├── chapter-3/
│   │   ├── index.html
│   │   ├── images/
│   │   └── videos/
│   └── chapter-4/
│       ├── index.html
│       ├── images/
│       └── videos/
├── process/
│   ├── index.html                  # 制作过程
│   └── videos/
│       └── within-process.mp4
├── source-materials/
│   ├── charts/                     # 调研图表与压缩包
│   ├── survey-data/                # Excel、导出文本与解析中间文件
│   └── thesis/                     # 轻量论文相关资料与问卷文档
├── thanks/
│   └── index.html                  # 感谢
└── archive/                        # 归档的参考页 / 临时脚本 / 中间文件
    ├── references/
    ├── scripts/
    ├── notes/
    └── legacy-assets/
```

## 页面链路

- `index.html` -> `about/index.html`
- `about/index.html` -> `research/index.html`
- `research/index.html` -> `design/index.html`
- `design/index.html` -> `chapters/index.html`
- `chapters/index.html` -> `chapters/chapter-1/index.html`
- `process/index.html` -> `thanks/index.html`

说明：
- 主线页面与章节页支持滚轮上滑/下滑连续跳转。
- 页顶上滑采用二段式确认：第一次上滑先拉开页面，第二次上滑返回上一页。

## 正式内容与归档内容

### 正式内容

- 根目录下的页面与素材目录都属于当前在用内容。
- `images/` 中的素材会被实际页面引用。
- `Log/` 用于记录每日修改。
- `启动预览.bat` 与 `启动预览.command` 分别用于 Windows / macOS 本地预览。
- `source-materials/` 中存放图表、问卷、Excel 与轻量文本资料。
- 体积较大的论文原始 `docx` 不放入 `Gradua/`，保留在仓库外层单独存放。

### archive

`archive/` 中存放不再参与当前站点运行、但仍保留备查价值的文件：

- `archive/references/`：参考页与旧预览页
- `archive/scripts/`：一次性使用过的临时脚本
- `archive/notes/`：中间文本产物
- `archive/legacy-assets/`：不再直接使用的旧素材副本

## 常改位置

### 首页主视觉

- 首页代码：`index.html`
- 主视觉图片：`title.png`

### 项目介绍 / 问题研究 / 核心设计

- 项目介绍：`about/index.html`
- 问题研究：`research/index.html`
- 核心设计：`design/index.html`

### 章节内容

- 章节导览：`chapters/index.html`
- 四个章节正文：
  - `chapters/chapter-1/index.html`
  - `chapters/chapter-2/index.html`
  - `chapters/chapter-3/index.html`
  - `chapters/chapter-4/index.html`

### 制作过程

- 页面：`process/index.html`
- 视频：`process/videos/within-process.mp4`

## 技术说明

- 纯静态站点，无构建流程
- 页面间使用显式 `.html` 相对路径
- 兼容本地 `file://` 打开
- 采用统一版心、统一导航、统一滚轮翻页交互

## 维护建议

- 正式站点相关文件尽量留在根目录与正式页面目录中，不要再把实验文件堆回根目录。
- 新的参考页、临时脚本、导出文本统一放入 `archive/`。
- 若页面结构再次大改，优先同步：
  - `README.md`
  - `Log/日期.md`
- 新增日志时统一使用“年月日 时:分”格式；若历史记录缺失精确时分，不补写虚构时间。

**最后更新：** 2026-05-05
