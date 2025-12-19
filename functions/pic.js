// EdgeOne Pages Function export
export function onRequest(context) {
  return handleRequest(context.request);
}

// 检测是否为移动设备
function isMobileDevice(userAgent) {
  if (!userAgent) return false;

  const mobileKeywords = [
    'Mobile', 'Android', 'iPhone', 'iPad', 'iPod', 'BlackBerry',
    'Windows Phone', 'Opera Mini', 'IEMobile', 'Mobile Safari',
    'webOS', 'Kindle', 'Silk', 'Fennec', 'Maemo', 'Tablet'
  ];

  const lowerUserAgent = userAgent.toLowerCase();

  for (let i = 0; i < mobileKeywords.length; i++) {
    if (lowerUserAgent.includes(mobileKeywords[i].toLowerCase())) {
      return true;
    }
  }

  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  return mobileRegex.test(userAgent);
}

// 首页 HTML 内容（内联）
const HOMEPAGE_HTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>二次元随机图片 API</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #f9f9ff;
      color: #333;
    }
    h1 {
      text-align: center;
      color: #6200ea;
    }
    .btn-group {
      text-align: center;
      margin: 20px 0;
    }
    button {
      background: #6200ea;
      color: white;
      border: none;
      padding: 10px 20px;
      margin: 5px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
    }
    button:hover {
      background: #3700b3;
    }
    .preview {
      margin-top: 20px;
      text-align: center;
    }
    img#preview {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      display: none;
    }
    pre {
      background: #eee;
      padding: 12px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 15px 0;
    }
    .note {
      font-size: 14px;
      color: #666;
      margin-top: 30px;
    }
  </style>
</head>
<body>

  <h1>🖼️ 二次元随机图片 API</h1>

  <p>本服务提供高质量的二次元横屏/竖屏随机图片，支持自动适配设备。</p>

  <div class="btn-group">
    <button onclick="loadImage('h')">横屏图片</button>
    <button onclick="loadImage('v')">竖屏图片</button>
    <button onclick="loadImage('ua')">自动适配（推荐）</button>
  </div>

  <div class="preview">
    <img id="preview" alt="加载中...">
  </div>

  <h2>📌 使用方法</h2>
  <p>你可以在任何网页、APP 或脚本中通过以下 URL 调用：</p>

  <pre>GET https://<strong>your-domain.com</strong>/?img=h   <!-- 横屏 -->
GET https://<strong>your-domain.com</strong>/?img=v   <!-- 竖屏 -->
GET https://<strong>your-domain.com</strong>/?img=ua  <!-- 自动适配 --></pre>

  <p>服务器会返回一个 <code>302</code> 重定向，指向实际的 <code>.webp</code> 图片地址（如 <code>/ri/h/123.webp</code>）。</p>

  <h2>💡 示例代码（HTML / JavaScript）</h2>
  <pre>&lt;img src="https://your-domain.com/?img=ua" alt="二次元图"&gt;</pre>

  <p>或通过 fetch 获取真实地址（适用于需要预加载的场景）：</p>
  <pre>fetch('https://your-domain.com/?img=ua')
  .then(res => res.headers.get('Location'))
  .then(url => console.log('真实图片地址:', url));</pre>

  <div class="note">
    <p>✅ 所有接口支持 CORS（<code>Access-Control-Allow-Origin: *</code>），可安全用于前端项目。</p>
    <p>📦 图片总数：横屏约 882 张，竖屏约 3289 张。</p>
  </div>

  <script>
    const preview = document.getElementById('preview');

    async function loadImage(type) {
      const apiUrl = \`/?img=\${type}\`;
      
      try {
        const response = await fetch(apiUrl, { method: 'HEAD' });
        if (response.status === 302 || response.redirected) {
          const imageUrl = response.headers.get('Location') || apiUrl;
          preview.src = imageUrl;
          preview.style.display = 'inline-block';
        } else {
          throw new Error('未收到重定向响应');
        }
      } catch (err) {
        alert('❌ 加载失败：' + err.message);
        preview.style.display = 'none';
      }
    }
  </script>

</body>
</html>
`;

async function handleRequest(request) {
  try {
    const url = new URL(request.url);
    const imgType = url.searchParams.get('img');

    // 🏠 如果访问的是根路径且没有 img 参数，返回首页
    if (url.pathname === '/' && !imgType) {
      return new Response(HOMEPAGE_HTML, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    const maxHorizontalImageNumber = 882;
    const maxVerticalImageNumber = 3289;

    if (imgType === 'h') {
      const randomNum = Math.floor(Math.random() * maxHorizontalImageNumber) + 1;
      const imageUrl = '/ri/h/' + randomNum + '.webp';
      return new Response(null, {
        status: 302,
        headers: {
          'Location': imageUrl,
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } else if (imgType === 'v') {
      const randomNum = Math.floor(Math.random() * maxVerticalImageNumber) + 1;
      const imageUrl = '/ri/v/' + randomNum + '.webp';
      return new Response(null, {
        status: 302,
        headers: {
          'Location': imageUrl,
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } else if (imgType === 'ua') {
      const userAgent = request.headers.get('User-Agent') || '';
      const isMobile = isMobileDevice(userAgent);

      let randomNum, imageUrl;
      if (isMobile) {
        randomNum = Math.floor(Math.random() * maxVerticalImageNumber) + 1;
        imageUrl = '/ri/v/' + randomNum + '.webp';
      } else {
        randomNum = Math.floor(Math.random() * maxHorizontalImageNumber) + 1;
        imageUrl = '/ri/h/' + randomNum + '.webp';
      }

      return new Response(null, {
        status: 302,
        headers: {
          'Location': imageUrl,
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } else {
      // 其他无效参数：也返回首页（更友好）
      return new Response(HOMEPAGE_HTML, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

  } catch (error) {
    const errorDetails = `❌ 内部错误\n\n错误消息: ${error.message}\n请求地址: ${request.url}\n时间戳: ${new Date().toISOString()}`;
    return new Response(errorDetails, {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}
