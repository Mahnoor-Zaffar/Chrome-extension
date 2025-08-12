export function simpleExtract(html) {
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const text = bodyMatch ? bodyMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  return {
    title: titleMatch ? titleMatch[1].trim() : '',
    text,
  };
}

