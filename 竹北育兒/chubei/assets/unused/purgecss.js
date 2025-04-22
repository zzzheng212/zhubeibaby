module.exports = {
    content: ['Main Page.html'], // 指定要掃描的文件
    css: ['assets/vendor/bootstrap/css/bootstrap.min.css'], // 指定要處理的 CSS 文件
    output: 'assets\css', // 指定輸出的目錄
  }

  const purgecss = require('@fullhuman/postcss-purgecss');

const fs = require('fs');
const path = require('path');

const config = require('./purgecss.config.js');

const purgeCSSResult = purgecss(config);

const outputDir = path.resolve(__dirname, config.output);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'styles.purged.css'), purgeCSSResult[0].css);