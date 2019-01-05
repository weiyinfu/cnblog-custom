//plugins
require("./RenderLatex") //渲染公式
require("./Catelog") //解析并插入目录
require("./ProgressBar") //顶部阅读进度条
require("./ControlPanel") //控制面板，解析页面信息并展示
//less，custom.less定制现有元素，dynamic.less定制新增元素
require("./custom.less")
require("./dynamic.less")

//postDetail的postTitle没有必要是链接
function removeLinkOfPostTitle() {
  var postTitle = $("#post_detail .postTitle")
  if (postTitle) {
    postTitle.html(postTitle.text())
  }
}

$(document).ready(function() {
  //如果是在博客内容页面上
  if (document.querySelector("#cnblogs_post_body")) {
    //去掉标题中的超链接
    removeLinkOfPostTitle()
  }
})
