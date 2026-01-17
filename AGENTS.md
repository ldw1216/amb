# AGENTS

## 目的
- 指导自动化开发代理在本仓库中高质量协作开发。

## 项目概览
- 前端：React + TypeScript + MobX + Parcel。
- 后端：Node.js + Koa + TypeScript。
- 数据库：MongoDB（Mongoose）。

## 目录结构
- `client/`：前端代码。
- `server/`：后端接口与业务逻辑。
- `server/model/`：数据库模型文件。
- `typings/`：全局类型定义。
- `config/`：配置文件。

## 关键约定
- 数据库连接在 `server/model/index.ts` 配置，或通过环境变量 `MONGOOSE_URI` 配置。
- 数据库模型放在 `server/model/`，对应的接口类型定义放在 `typings/`，并在 `amb` 命名空间下以 `I` 开头命名。
- 前端开发时可使用 `window.rootStore` 访问根 Store。

## 常用命令
- 安装依赖：`npm install`
- 启动后端：`npm run server`
- 启动前端：`npm run client`
- 同时启动：`npm run dev`
- 构建服务端（类型检查）：`npm run build-server`
- 构建全部：`npm run build`
- 生产启动：`npm run start`

## 编码规范与质量
- TypeScript 严格类型，避免 `any`，函数参数与返回值必须标注类型。
- 使用 `interface` 定义对象类型，使用 `type` 定义联合类型。
- 类型导入使用 `import type`。
- React 使用函数组件与 Hooks，并在需要时使用 `memo` / `useCallback` / `useMemo` 优化性能。
- 函数单一职责，尽量控制在 50 行内，遵循 DRY 原则。
- 关键位置（如数据库查询、重要事件）需添加必要日志，便于排查问题。

## 变更流程
- 任何可能的破坏性变更需先确认再实施。
- 如果存在对应需求文档，请同步更新。
- 修改后检查终端控制台是否有报错，并运行类型检查。
- Git 提交信息使用中文，简洁清晰。
