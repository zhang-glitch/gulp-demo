const {src, dest, parallel, series, watch} = require("gulp")
// 安装sass,gulp-sass
const sass = require('gulp-sass')(require('sass'));
// // babel只是一个转换平台，我们还需要安装对应的插件来时间对应语法的转化功能。
// // @babel/core @babel/preset-env
// const babel = require("gulp-babel")
// // gulp-swig处理swig模板语法
// const swig = require("gulp-swig")
// // gulp-imagemin处理图片,我们需要安装6.1.0版本，否则模块化不兼容
// const imagemin = require("gulp-imagemin")
// 删除上一次打的包 ，需要安装5.1.0版本
const del = require("del")

// gulp-load-plugins该插件将所有gulp相关插件都挂载到该对象上，方便了我们使用
const plugins = require("gulp-load-plugins")()
// 开发服务器
const browserSync = require("browser-sync")

const bs = browserSync.create()

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
          name: 'About',
          link: 'https://juejin.cn/user/2225067267204935/columns'
        },
        {
          name: 'About',
          link: 'https://github.com/zhang-glitch'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

const style = () => {
  // 需要指定打包的base，来达到输出同样的目录
  return src("src/assets/styles/*.scss", {base: "src"}).pipe(sass()).pipe(dest("temp")).pipe(bs.reload({stream: true}))
}

const script = () => {
  return src("src/assets/scripts/*.js", {base: "src"}).pipe(plugins.babel({presets: ["@babel/preset-env"]})).pipe(dest("temp")).pipe(bs.reload({stream: true}))
}

const page = () => {
  // 匹配到src下面的所有html文件 
  // cache: false防止模板缓存导致页面不能及时更新
  return src("src/*.html", {base: "src"}).pipe(plugins.swig({data, defaults: {
    cache: false}})).pipe(dest("temp")).pipe(bs.reload({stream: true}))
}

// 无损压缩
const image = () => {
  return src("src/assets/images/**", {base: "src"}).pipe(plugins.imagemin()).pipe(dest("dist"))
}
// 无损压缩
const font = () => {
  return src("src/assets/fonts/**", {base: "src"}).pipe(plugins.imagemin()).pipe(dest("dist"))
}

const extra = () => {
  return src("public/**", {base: "public"}).pipe(dest("dist"))
}

const clean = () => {
  return del(["dist", "temp"])
}

const server = () => {
  // 监听src下的文件变化
  watch("src/assets/styles/*.scss", style)
  watch("src/assets/scripts/*.js", script)
  watch("src/*.html", page)
  // watch("src/assets/images/**", image)
  // watch("src/assets/fonts/**", font)
  // watch("public/**", extra)

  // 当图片等资源发生变化，自动刷新浏览器
  watch([
    "src/assets/images/**",
    "src/assets/fonts/**",
    "public/**"
  ], bs.reload)
  bs.init({
    notify: false,
    // 那些文件改变，可以热更新
    // files: "dist/**",
    server: {
      // 一些静态资源，图片等在开发过程中我们不需要编译打包，所以在src，public中直接获取，提高构建效率
      baseDir: ["temp", "src", "public"],
      // 优先级高于baseDir
      routes: {
        "/node_modules": "node_modules"
      }
    }
  })
}

// 通过构建注释，来加载引入的依赖
// <!-- build:css assets/styles/main.css -->
//   <link rel="stylesheet" href="assets/styles/main.css">
//   <!-- endbuild -->
const useref = () => {
  return src("temp/*.html", {base: "temp"})
  .pipe(
    plugins.useref({
      searchPath: ["temp", "."]
    })
  )
  // 压缩js,css,html
  .pipe(plugins.if(/\.js$/, plugins.uglify()))
  .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
  .pipe(plugins.if(/\.html$/, plugins.htmlmin({
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true
  })))
  .pipe(dest("dist"))
}
// 并行处理js,css,html文件
const compile = parallel(style, script, page)

const build = series(clean, parallel(series(compile, useref), image, font, extra))

const dev = series(clean, compile, server)

module.exports = {
  build,
  compile,
  dev,
  useref
}