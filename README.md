博客园配置

# 目录结构说明
* custom.less:博客园现有样式的CSS
* dynamic.less：js生成的class的样式定义
* Catelog.js：目录插件，功能包括：从随笔中解析header，把header转化为层次化结构；绑定滚动事件，让目录随着博客内容而滚动
* ControlPanel：控制面板插件，把许多链接、作者简介、随笔相关的内容放到悬浮窗口中，节省空间，使得界面在保持简洁的基础上，尽量保留旧有功能
* RenderLatex：latex公式渲染插件
* ProgressBar：顶部阅读进度插件
* index.js：根文件，利用此文件依赖以上各个插件

# 开发方式
在部署阶段，将webpack之后生成到dist中的css和js文件上传到博客园，然后就可以使用了。

在开发阶段，需要一边改一遍查看效果，这有两种方法：
* 直接更改博客园配置，让css和js请求本地的web-dev-server服务器
* 使用fiddler进行映射，映射到本地的web-dev-server
