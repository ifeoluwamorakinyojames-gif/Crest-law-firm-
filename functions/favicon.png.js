export async function onRequestGet({env}){
 if(!env.DB||!env.MEDIA)return new Response('Favicon not configured',{status:404});
 const setting=await env.DB.prepare("SELECT value FROM site_settings WHERE key='favicon_url'").first();
 const match=setting?.value?.match(/^\/media\/([a-f0-9-]{36}\.(?:png|jpg|webp|avif))$/);
 if(!match)return new Response('Favicon not configured',{status:404});
 const object=await env.MEDIA.get(match[1]);
 if(!object)return new Response('Favicon not found',{status:404});
 return new Response(object.body,{headers:{'Content-Type':object.httpMetadata?.contentType||'image/png','Cache-Control':'public,max-age=3600','X-Content-Type-Options':'nosniff'}});
}
