
export default {
  entry: "./client/index.tsx",
  extraBabelPlugins: [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]
  ],
  manifest: { "basePath": "/" },
  hash: true,
  ignoreMomentLocale: true,
  publicPath: '/',
  outputPath: "dist-client",
  html: { "template": "./client/index.ejs" }
}
