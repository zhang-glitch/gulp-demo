const {src, dest, parallel} = require("gulp")
// 安装sass,gulp-sass
const sass = require('gulp-sass')(require('sass'));
// babel只是一个转换平台，我们还需要安装对应的插件来时间对应语法的转化功能。
// @babel/core @babel/preset-env
const babel = require("gulp-babel")
// gulp-swig处理swig模板语法
const swig = require("gulp-swig")
// gulp-imagemin处理图片,我们需要安装6.1.0版本，否则模块化不兼容
const imagemin = require("gulp-imagemin")

const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Features',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

const style = () => {
  // 需要指定打包的base，来达到输出同样的目录
  return src("src/assets/styles/*.scss", {base: "src"}).pipe(sass()).pipe(dest("dist"))
}

const script = () => {
  return src("src/assets/scripts/*.js", {base: "src"}).pipe(babel({presets: ["@babel/preset-env"]})).pipe(dest("dist"))
}

const page = () => {
  // 匹配到src下面的所有html文件
  return src("src/**/*.html", {base: "src"}).pipe(swig({data})).pipe(dest("dist"))
}

// 无损压缩
const image = () => {
  return src("src/assets/images/**", {base: "src"}).pipe(imagemin()).pipe(dest("dist"))
}
// 无损压缩
const font = () => {
  return src("src/assets/fonts/**", {base: "src"}).pipe(imagemin()).pipe(dest("dist"))
}

const extra = () => {
  return src("public/**", {base: "public"}).pipe(dest("dist"))
}
// 并行处理js,css,html文件
const compile = parallel(style, script, page, image, font, extra)

module.exports = {
  style,
  script,
  page,
  image,
  compile
}