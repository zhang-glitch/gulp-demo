const {src, dest} = require("gulp")
// 安装sass,gulp-sass
const sass = require('gulp-sass')(require('sass'));
// babel只是一个转换平台，我们还需要安装对应的插件来时间对应语法的转化功能。
// @babel/core @babel/preset-env
const babel = require("gulp-babel")

const style = () => {
  // 需要指定打包的base，来达到输出同样的目录
  return src("src/assets/styles/*.scss", {base: "src"}).pipe(sass()).pipe(dest("dist"))
}

const script = () => {
  return src("src/assets/scripts/*.js", {base: "src"}).pipe(babel({presets: ["@babel/preset-env"]})).pipe(dest("dist"))
}

module.exports = {
  style,
  script
}