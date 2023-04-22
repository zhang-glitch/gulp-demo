module.exports = {
  // 提供模板数据
  data: {
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
  },
  // 传递路径配置
  build: {
    src: 'src',
    dist: 'dist',
    temp: '.tmp',
    public: 'public',
    paths: {
      styles: 'assets/styles/*.scss',
      scripts: 'assets/scripts/*.js',
      pages: '*.html',
      images: 'assets/images/**',
      fonts: 'assets/fonts/**'
    }
  }
}