function fetchWithTimeout(url, opts = {}, ms = 2000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

async function getYouTubeEmbedUrl(dishName) {
  const query = encodeURIComponent(dishName + " recipe");
  try {
    const r = await fetchWithTimeout(
      `https://www.youtube.com/feeds/videos.xml?search_query=${query}`,
      { headers: { "User-Agent": "FridgeChef/1.0" } },
      3000
    );
    const text = await r.text();
    const match = text.match(/href="https:\/\/www\.youtube\.com\/watch\?v=([^"&]+)"/);
    if (match?.[1]) {
      return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
    }
  } catch (e) {
    console.error("fetch failed", e);
  }
  return `https://www.youtube.com/embed?listType=search&list=${query}`;
}

getYouTubeEmbedUrl('chicken').then(console.log).catch(console.error);
