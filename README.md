博客园配置

# 功能说明
* 顶部进度条
* 自动目录、联动目录
* 以图片形式展示公式
* 去掉无用链接，使用控制面板的方式展示链接、用户信息、可用操作

# 目录结构说明
* custom.less:博客园现有样式的CSS
* dynamic.less：js生成的class的样式定义
* Catelog.js：目录插件，功能包括：从随笔中解析header，把header转化为层次化结构；绑定滚动事件，让目录随着博客内容而滚动
* ControlPanel：控制面板插件，把许多链接、作者简介、随笔相关的内容放到悬浮窗口中，节省空间，使得界面在保持简洁的基础上，尽量保留旧有功能
* RenderLatex：latex公式渲染插件
* ProgressBar：顶部阅读进度插件
* index.js：根文件，利用此文件依赖以上各个插件

# 开发方式
## 部署
在部署阶段，将webpack之后生成到dist中的css和js文件上传到博客园设置/文件，在设置中把css添加到头部html中，把js添加到底部html中，然后就可以使用了。

## 开发
在开发阶段，需要一边改一边查看效果，有两种方法实现：
* 下策：直接更改博客园设置，把头部css和底部js的URL改为localhost的资源，让css和js请求本地的web-dev-server服务器，这种方式会导致别的用户加载css和js失败。故为下策。
* 上策：使用fiddler进行映射，映射到本地的web-dev-server。这种方式对其它用户没有影响（他们使用的js和css依旧为博客园“文件”中的内容）。fiddler可以将css和js请求映射为请求本地资源。
