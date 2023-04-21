const {src, dest} = require("gulp")
// 安装sass,gulp-sass
const sass = require('gulp-sass')(require('sass'));

const style = () => {
  // 需要指定打包的base，来达到输出同样的目录
  return src("src/assets/styles/*.scss", {base: "src"}).pipe(sass()).pipe(dest("dist"))
}

module.exports = {
  style
}