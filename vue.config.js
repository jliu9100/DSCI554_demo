// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true,
//   devServer: {
//       overlay: {
//         warnings: false,
//         errors: false
//       }
//   },
//   lintOnSave: false
// })

// module.exports = {
//   devServer: {
//     overlay: false,
//   }
// }
module.exports = {
  devServer: {
    client: {
      overlay: false
    },
  },
};
