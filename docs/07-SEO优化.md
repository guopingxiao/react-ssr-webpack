# 1. SEO优化
+ 搜索引擎优化`Search engine optimization`
+ 为什么服务端渲染会对SEO更加友好？
+ 搜索引擎分析网站的时候，搜集网站的全部内容，进行分析，然后得出一个主题，这个主题，就是搜索关键词
+ **Title和Description的真正作用是提高网站的转化率，不在于SEO优化**，用户看到网站后，这两个比较吸引用户；
+ 网站的三部分：文字，链接和媒体。文字的原创；链接的相关性，外部链接越多，网站的欢迎程度越好；图片的原创，高清，

### 1.1 使用react-helmet进行SEO优化

+ 代码在服务器端执行

```javascript
import { Helmet } from 'react-helmet';
const helmet = Helmet.renderStatic();

<head>
	<meta charset="UTF-8">
	${helmet.title.toString()}
	${helmet.meta.toString()}
	<style>${cssStr}</style>
</head>
```
+ 代码在客户端执行
```javascript
// home.js
import { Helmet } from 'react-helmet';

<Helmet>
	<title>Home Page</title>
	<meta charSet="utf-8"/>
	<meta name="my home" content="努力学习react的SSR"/>
</Helmet>
```


