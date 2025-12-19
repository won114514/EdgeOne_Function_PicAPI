// EdgeOne Pages Function - 仅处理 /pic 路径
export function onRequest(context) {
  return handleRequest(context.request);
}

function isMobileDevice(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  const keywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry',
    'windows phone', 'opera mini', 'iemobile', 'webos', 'kindle', 'tablet'];
  if (keywords.some(kw => ua.includes(kw))) return true;
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
}

async function handleRequest(request) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 只处理 /pic 路径
    if (pathname !== '/pic') {
      // 其他路径（包括 /）由 Pages 静态文件服务处理
      // 所以这里不返回任何内容，让 Pages 继续 fallback 到 public/
      return null; // 或者让函数不拦截
    }

    const imgType = url.searchParams.get('img');

    // 🔁 无参数时跳转到根目录
    if (!imgType) {
      return Response.redirect(new URL('/', request.url).toString(), 302);
    }

    const MAX_H = 882;
    const MAX_V = 3289;

    let imageUrl;
    if (imgType === 'h') {
      const n = Math.floor(Math.random() * MAX_H) + 1;
      imageUrl = `/ri/h/${n}.webp`;
    } else if (imgType === 'v') {
      const n = Math.floor(Math.random() * MAX_V) + 1;
      imageUrl = `/ri/v/${n}.webp`;
    } else if (imgType === 'ua') {
      const ua = request.headers.get('User-Agent') || '';
      const isMobile = isMobileDevice(ua);
      const n = Math.floor(Math.random() * (isMobile ? MAX_V : MAX_H)) + 1;
      imageUrl = (isMobile ? '/ri/v/' : '/ri/h/') + n + '.webp';
    } else {
      return new Response('❌ 无效的 img 参数！仅支持：h（横屏）、v（竖屏）、ua（自动）', {
        status: 400,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }

    return new Response(null, {
      status: 302,
      headers: {
        'Location': imageUrl,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    return new Response(`❌ 服务器内部错误\n${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}
