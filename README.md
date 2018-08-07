# 好看阿米巴管理系统

## start
1. 参考原型 ：http://www.pmdaniu.com/cloud/23651/34ea771de53143df5a5a1f14f6556dc2-10237/start.html
2. 本项目依赖nodejs + mongodb 
3. 数据库连接配置 可在/server/model/index.ts中配置数据库连接，也可使环境变量 MONGOOSE_URI 配置数据库连接

## 项目目录结构

```
├── README.md
├── client                    客户端（前端）
│   ├── Layout.tsx            布局文件（前端路由）
│   ├── axios-init.ts         axios配置
│   ├── budget                预算模块
│   ├── components            通用组件  可在项目中直接引入如： import SearchBox from "components/SearchBox"
│   ├── dev.js                前端开发环境入口文件  执行 node client/dev.js 会自动运行前端项目
│   ├── index.html            入口html
│   ├── index.tsx             入口tsx
│   ├── login                 登录
│   └── user
│       ├── index.tsx
│       ├── sector
│       └── user
└── dist                     前端打包文件 线上部署使用
└── dist-server              后端打包文件 线上部署使用
├── nodemon.json
├── package.json
├── server                   服务端项目（接口、数据库）
│   ├── api                  接口  本目录下文件名包含 .router. 会自动加载
│   │   ├── group.router.ts  
│   │   └── index.ts
│   ├── app.ts               
│   ├── index.ts             服务端入口
│   ├── lib
│   └── model                数据库定义文件  .model. 会自动加载
│       ├── group.model.ts
│       ├── index.ts         数据库配置
│       └── user.model.ts
├── tsconfig.json
├── tsconfig.server.json     服务端ts配置
├── tslint.json
└── typings                  接口定义
    └── typings.d.ts
```

## 项目启动
+ 后端 `npm run server`
+ 前端 `npm run client`
+ 同时启动 `npm run dev`
+ 如果后端没启动的话，只起动前端会因无法连接接口报错


## 项目部署
+ 运行 `npm run build` 文件会打包到 `/dist`文件夹 直接运行 node dist/server 可启动项目 或 npm start 启动项目

## 开发规范
+ 所有数据库文件放入 `/server/model` 文件夹下，定义数据库时 一并定义 interface 到 `/typings`文件夹下，定义到 namespace amb  且使用I开头
