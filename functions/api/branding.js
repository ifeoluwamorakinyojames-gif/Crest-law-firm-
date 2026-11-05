import {verifyAdmin} from '../_auth.js';
const keys=['logo_url','banner_url','favicon_url'];
const safe=v=>typeof v==='string'&&v.length<=250&&/^\/media\/[a-f0-9-]{36}\.(png|jpg|webp|avif)$/.test(v);
export async function onRequestGet({env}){
 if(!env.DB)return Response.json({branding:{}},{headers:{'Cache-Control':'no-store'}});
 const data=await env.DB.prepare("SELECT key,value FROM site_settings WHERE key IN ('logo_url','banner_url','favicon_url')").all();
 return Response.json({branding:Object.fromEntries(data.results.map(r=>[r.key,r.value]))},{headers:{'Cache-Control':'no-store'}});
}
export async function onRequestPut({request,env}){
 if(!await verifyAdmin(request,env))return Response.json({error:'Unauthorized'},{status:401});
 if(!env.DB)return Response.json({error:'Database unavailable'},{status:503});
 let body;try{body=await request.json()}catch{return Response.json({error:'Invalid JSON'},{status:400})}
 if(!body||typeof body!=='object'||Array.isArray(body))return Response.json({error:'Invalid settings'},{status:400});
 const entries=Object.entries(body);
 if(!entries.length||entries.some(([key,value])=>!keys.includes(key)||!safe(value)))return Response.json({error:'Upload an approved image before saving'},{status:400});
 await env.DB.batch(entries.map(([key,value])=>env.DB.prepare('INSERT INTO site_settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').bind(key,value)));
 return Response.json({ok:true});
}
