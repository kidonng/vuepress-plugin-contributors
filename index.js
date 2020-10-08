const { path } = require('@vuepress/shared-utils')

module.exports = (options = {}, ctx) => ({
  extendPageData($page) {
    const { repo, docsRepo, docsBranch = 'master', docsDir } =
      ctx.themeConfig || {}

    $page.contributors = {
      docsRepo: docsRepo || repo,
      docsBranch,
      docsDir,
      label: 'Contributors',
      ...options
    }
  },
  enhanceAppFiles: [path.resolve(__dirname, 'enhanceAppFile.js')]
})
