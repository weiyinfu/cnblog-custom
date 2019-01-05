/*
顶部进度条插件
*/

var readProgressBar = "readProgressBar"
function get(s) {
  return document.querySelector(s)
}
function getTargetPos() {
  return get("#cnblogs_post_body").scrollHeight - get("#main").clientHeight
}
/*
当在移动端时，left和right都排布在main里面，没有滚动条，滚动条在main上面
获取当前滚动条位置的方法就是取left和main滚动条位置中的较大值，这样就能够完美适配多个终端
*/
function getCurrentPos() {
  var leftScrollTop = get("#left").scrollTop
  var mainScrollTop = get("#main").scrollTop
  return Math.max(leftScrollTop, mainScrollTop)
}
function onScrollPost() {
  var targetPos = getTargetPos()
  var currentPos = getCurrentPos()
  var value = currentPos / targetPos
  value *= 100
  value = Math.min(100, value)
  value = Math.max(0, value) 
  get("#" + readProgressBar).style.width = `${value}%`
}
$(document).ready(() => {
  if (get("#cnblogs_post_body")) {
    $("body").prepend(`<div id='${readProgressBar}'></div>`)
    $("#left").scroll(onScrollPost)
    $("#main").scroll(onScrollPost)
  }
})
