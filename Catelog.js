/*
本文件用于生成目录：
* 通过提取#cnblogs_post_body中的全部header元素（markedown渲染结束的结果），得到一个header列表
* 根据header列表中header的等级把这些header弄成树形结构
* 把树形结构转化为html字符串，把目录添加到DOM中
* 监听左侧滚动条事件，目录随着左侧阅读而联动高亮
*/

//深度优先搜索遍历DOM树全部结点，找到header结点
function dfs(node, nowList) {
  if (!node.tagName) return
  if (/^h[1-6]$/i.test(node.tagName)) {
    nowList.push(node)
    return
  }
  if (node.children) {
    for (var i = 0; i < node.children.length; i++) {
      dfs(node.children[i], nowList)
    }
  }
}
//把header列表转换成层次结构，输入参数headers是一个元素列表
function packHeaders(headers) {
  //目录应该是错落有致的，遇到比我小的目录就要添加ul，遇到比我大的head就要跳出去
  function packOne(headers, me) {
    var ind = me + 1
    var sons = []
    while (ind < headers.length && headers[ind].tagName > headers[me].tagName) {
      var res = packOne(headers, ind)
      ind = res.nextIndex
      sons.push(res)
    }
    return { nextIndex: ind, element: headers[me], sons: sons }
  }

  var ind = 0
  var ansList = [] //最终得到一个有层次的header列表
  while (ind < headers.length) {
    var res = packOne(headers, ind)
    ind = res.nextIndex
    ansList.push(res)
  }
  return ansList
}
//把层次化的header列表转换为html字符串
function headersToString(headerList) {
  var idCounter = 0//计数器，给各个header添加锚点
  function tos(header) {
    //把一个header转成一个字符串，header形如{element:xx,sons:[xxx]}
    var s = []
    var myId = idCounter++
    var ele = $(header.element)
    s.push("<li>")
    s.push(`<a href="#${myId}" class=${ele.get(0).tagName.toLowerCase()}>${ele.text()}</a>`)
    ele.prepend(`<a name='${myId}'></a>`)
    if (header.sons.length) {
      s.push("<ul>")
      for (var i of header.sons) {
        s.push(tos(i))
      }
      s.push("</ul>")
    }
    s.push("</li>")
    return s.join("")
  }

  var s = []
  s.push("<ul>") //根元素
  for (var h of headerList) {
    s.push(tos(h))
  }
  s.push("</ul>")
  return s.join("")
}

function getHeaderList(html) {
  //html是一个jquery对象
  var headers = []
  dfs(html.get(0), headers)
  headers = packHeaders(headers)
  var s = headersToString(headers)
  return s
}
//把目录添加到右侧
function addCatelog() {
  //添加目录
  var lis = getHeaderList($("#cnblogs_post_body"))
  if ($(lis).children().length) {
    //如果有目录才添加，没有目录就不要添加了
    var ul = $("<div class='catelog'></div>")
    ul.html(lis)
    ul.prepend($("<div class='title'>目录</div>"))
    $("#right_content").prepend(ul)
  }
}
//获取当前可见的最后一个header，用于高亮显示当前正在阅读的章节
function getLastHeader() {
  var links = $(".catelog li a")
  var leftPanel = document.querySelector("#left")
  var scrollPos = leftPanel.scrollTop + leftPanel.clientHeight / 2
  var lastCanSee = null
  for (var i = 0; i < links.length; i++) {
    var ele = links.eq(i)
    ele.css("backgroundColor", "white")
    var targetName = ele.attr("href").slice(1)
    var target = document.getElementsByName(targetName)
    if (target.length) {
      //如果能够找到目标元素
      if (target[0].offsetTop < scrollPos) {
        lastCanSee = ele
      }
    }
  }
  return lastCanSee
}
$(document).ready(() => {
  if (document.querySelector("#cnblogs_post_body")) {
    addCatelog()
    $("#left").scroll(() => {
      var element = getLastHeader()
      if (element) {
        element.css("backgroundColor", "wheat")
        element.get(0).scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        })
      }
    })
  }
})
