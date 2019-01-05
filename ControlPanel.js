/*用于解析页面数据,解析用户的随笔数、粉丝数、昵称、园龄、关注数等信息 */
url = require("url")
function getCommonLinks(info) {
  return {
    //我关注的人
    care: `https://home.cnblogs.com/u/${info.userid}/followees`,
    //关注我的人
    follower: `https://home.cnblogs.com/u/${info.userid}/followers`,
    //主页
    home: `https://home.cnblogs.com/u/${info.userid}/`,
    //我的标签
    tag: `https://www.cnblogs.com/${info.userid}/tag/`,
    //管理
    manage: `https://i.cnblogs.com/`,
    //评论我的
    commentMe: `https://www.cnblogs.com/${info.userid}/RecentComments.html `,
    //我评论的
    IComment: `https://www.cnblogs.com/${info.userid}/MyComments.html`,
    //我的随笔
    post: `https://www.cnblogs.com/${info.userid}/p/`,
    //新随笔
    newPost: `https://i.cnblogs.com/EditPosts.aspx?opt=1`,
    //我参与的
    participate: `https://www.cnblogs.com/${info.userid}/OtherPosts.html `,
    //联系我
    contact: `https://msg.cnblogs.com/send/${info.nickname}`,
    //编辑当前博客
    edit: `https://i.cnblogs.com/EditPosts.aspx?postid=${info.postId}`
  }
}
//解析字符串中的数字，返回一个数字数组
function getNumbers(s) {
  return s
    .replace(/[^0-9]/g, " ")
    .trim()
    .split(/\s+/g)
    .map(x => parseInt(x))
}
//解析URL，获取用户ID和随笔ID
function parseUrl() {
  nowLocation = url.parse(location.href)
  var postPageRegex = /(\w+)\/p\/(\d+).html/
  var groups = postPageRegex.exec(nowLocation.path)
  if (postPageRegex.test(nowLocation.path)) {
    var userid = groups[1]
    var postId = groups[2]
    return { userid, postId, isPostPage: true }
  } else {
    var a = { isPostPage: false }
    var userid = nowLocation.path.split("/").filter(x => {
      return x.trim().length > 0
    })
    if (userid.length) {
      a.userid = userid.join()
    }
    return a
  }
}
//解析blog_stats字段，获取用户的随笔数、文章数、评论数
function parseBlogStats() {
  var [postCount, articleCount, blogCommentCount] = getNumbers($("#blog_stats").text())

  return {
    postCount,
    articleCount,
    blogCommentCount
  }
}
//解析用户简介，包括昵称、注册时间、粉丝数、关注数
//注意用户昵称和用户ID不是一回事
function parseProfile() {
  var profileLinks = $("#profile_block a")
  var a = {
    nickname: profileLinks.eq(0).text(),
    registerTime: getNumbers(profileLinks.eq(1).attr("title")),
    fansCount: parseInt(profileLinks.eq(2).text()),
    careCount: parseInt(profileLinks.eq(3).text())
  }
  return a
}
//解析积分和排名
function parseScoreRank() {
  var [score, rank] = getNumbers($("#sidebar_scorerank").text())
  return { score, rank }
}
//解析博客描述，包括创建时间、评论数、阅读数
function parsePostDesc() {
  if (document.querySelector("#cnblogs_post_body")) {
    return {
      createAt: $("#post-date").text(),
      readCount: $("#post_view_count").text(),
      postCommentCount: $("#post_comment_count").text()
    }
  } else {
    return {}
  }
}
//合并字典
function merge(target, source) {
  for (var i in source) {
    target[i] = source[i]
  }
}
function render(a, links) {
  var html = `
  <div id='ControlPanel' class="panel">
    <div class="header">控制面板('Esc' to Toggle)</div>
    <div class="block" id="userinfo">
      <div>昵称：<a href='${links.home}' target="_blank">${a.nickname}</a></div>
      <div>积分：${a.score}</div>
      <div>排名：${a.rank}</div>
      <div>粉丝：<a href='${links.follower}' target="_blank">${a.fansCount}</a></div>
      <div>关注：<a href='${links.care}' target="_blank">${a.careCount}</a></div>
      <div>随笔数：<a href='${links.post}' target="_blank">${a.postCount}</a></div>
      <div>评论数：<a href='${links.commentMe}' target="_blank">${a.blogCommentCount}</a></div>
      <div>文章数：${a.articleCount} </div>
      <div>注册时间：${a.registerTime.join("-")}</div>
      <br>
    </div>
    <div class='block' id='links'>
      <div><a href='${links.manage}' target="_blank">管理</a></div>
      <div><a href='${links.newPost}' target="_blank">新随笔(Ctrl+N)</a></div>
      <div><a href='${links.IComment}' target="_blank">我评论的</a></div>
      <div><a href='${links.commentMe}' target="_blank">评论我的</a></div>
      <div><a href='${links.participate}' target="_blank">我参与的</a></div>
      <div><a href='${links.tag}' target="_blank">我的标签</a></div>
      <div><a href='${links.contact}' target="_blank">联系我</a></div>
    </div>
    <div class="block" id="post" style="display:${a.isPostPage ? "block" : "none"}">
      <div>发布于：${a.createAt}</div>
      <div>阅读量：${a.readCount}</div>
      <div>评论量：${a.postCommentCount}</div>
      <div><a href='${links.edit}' target="_blank">编辑(Ctrl+E)</a></div>
    </div>
    <div style="clear:both">
  </div>
  `
  return html
}
function bindEvent(a, links) {
  $("body").keydown(e => {
    var ch = String.fromCodePoint(e.keyCode).toLowerCase()
    var handled = false
    if (e.ctrlKey && ch == "e" && a.postId) {
      //edit
      location.href = links.edit
      handled = true
    }
    if (e.ctrlKey && ch == "n") {
      //new
      location.href = links.newPost
    }
    if (e.keyCode == 27) {
      //escape
      $("#ControlPanel").toggle()
      handled = true
    }
    if (handled) {
      e.preventDefault()
      e.stopPropagation()
    }
  })
}
function main() {
  var a = {}
  merge(a, parseBlogStats())
  merge(a, parseUrl())
  merge(a, parseScoreRank())
  merge(a, parseProfile())
  merge(a, parsePostDesc())
  var links = getCommonLinks(a)
  $("body").append($(render(a, links)))
  //绑定键盘事件
  bindEvent(a, links)
  //在顶部添加About按钮
  $("#banner #Header1_HeaderTitle").after("<span id='bannerAboutButton'>About</span>")
  $("#bannerAboutButton").click(() => $("#ControlPanel").toggle())
}
//因为许多信息都是ajax请求得到的，所以需要晚一会儿解析html内容
$(document).ready(() => setTimeout(main, 2000))
