module.exports = {
  plugins: {
    // 'autoprefixer': {
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    // 这个插件转换不了行内样式
    "postcss-pxtorem": {
      // 黑马头条的设计稿 750px
      // vantUI 组件库的设计稿尺寸是 375px
      // 设成75，我们的样式比例ok，但是vant的样式小了，
      // 设成37.5，vant的ok，我们的大了
      // 每次转换px成rem时，都会经过这个函数，
      // 这个file就是当前正在转换的那个文件的文件路径
      // rootValue: function ({ file }) {}
      rootValue: ({ file }) => (file.includes("vant") ? 37.5 : 75),
      propList: ["*"],
      // 转rem忽略这个文件
      exclude: "github-markdown",
    },
  },
};
