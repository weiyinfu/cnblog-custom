/**
 * 把博客内容中的公式字符串转换为图片
 * */

function get(ele) {
  return document.querySelector(ele)
}

/**
 * 判断字符串s的beg处是否为ss，其实可以使用startsWith函数
 * */
function is(s, beg, ss) {
  var j = 0
  for (; j < ss.length && beg + j < s.length; j++) {
    if (s[beg + j] != ss[j]) return false
  }
  return j == ss.length
}

/**
 * 在字符串s中，从beg位置开始寻找下一个waiting元素
 * */
function waitfor(s, beg, waiting) {
  for (var i = beg; i < s.length; i++) {
    if (is(s, i, waiting)) return i + waiting.length
  }
  return s.length
}

/**
 * 主要解析部分，将“$公式$”替换为行内图片，
 * 将“$$公式$$”替换为块级图片
 * */
function parse(s) {
  var ans = ""
  var keepSame = [
    //遇到代码之后等待代码结束，对代码内部的公式不作处理
    { beg: "```", end: "```" },
    { beg: "`", end: "`" },
    { beg: "<pre", end: "</pre>" },
    { beg: "<code", end: "</code>" }
  ]
  for (var i = 0; i < s.length; ) {
    if (is(s, i, "$$")) {
      j = waitfor(s, i + 2, "$$")
      ans += getFormulaImage(s.substring(i + 2, j - 2), "block-image")
      i = j
    } else if (is(s, i, "$")) {
      j = waitfor(s, i + 1, "$")
      ans += getFormulaImage(s.substring(i + 1, j - 1), "inline-image")
      i = j
    } else {
      var handled = false
      for (var j = 0; j < keepSame.length; j++) {
        if (is(s, i, keepSame[j].beg)) {
          k = waitfor(s, i + keepSame[j].beg.length, keepSame[j].end)
          ans += s.substring(i, k)
          i = k
          handled = true
          break
        }
      }
      if (handled) {
        continue
      } else {
        ans += s[i]
        i++
      }
    }
  }
  return ans
}

/**
 * 根据latex公式s和图片类型type获取<img>元素
 * */
function getFormulaImage(s, type) {
  var codecogs = "https://weiyinfu.cn/latexserver/render?formula="
  var url = codecogs + encodeURIComponent(s)
  var ans = `<img class='${type}' src='${url}'  alt='${s}' />`
  return ans
}

function render(element) {
  var s = parse(get(element).innerHTML)
  get(element).innerHTML = s
}
$(document).ready(() => {
  if (document.querySelector("#cnblogs_post_body")) {
    render("#cnblogs_post_body")
  }
})
