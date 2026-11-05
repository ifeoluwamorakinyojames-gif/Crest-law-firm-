import {verifyAdmin} from '../_auth.js';
export async function onRequestGet({request,env}){
 if(!await verifyAdmin(request,env))return Response.json({error:'Unauthorized'},{status:401});
 if(!env.DB)return Response.json({error:'Database unavailable'},{status:503});
 const rows=await env.DB.prepare('SELECT id,name,email,topic,message,created_at FROM enquiries ORDER BY created_at DESC LIMIT 100').all();
 return Response.json({enquiries:rows.results},{headers:{'Cache-Control':'no-store'}});
}
export async function onRequestPost({request,env}){
 if(!env.DB)return Response.json({error:'Database unavailable'},{status:503});
 if(!env.TURNSTILE_SECRET_KEY)return Response.json({error:'Enquiry protection not configured'},{status:503});
 const contentType=request.headers.get('content-type')||'';
 if(!contentType.toLowerCase().startsWith('application/json'))return Response.json({error:'JSON required'},{status:415});
 const length=Number(request.headers.get('content-length')||0);
 if(length>8000)return Response.json({error:'Request too large'},{status:413});
 let d;try{d=await request.json()}catch{return Response.json({error:'Invalid JSON'},{status:400})}
 if(!d||typeof d!=='object'||Array.isArray(d))return Response.json({error:'Invalid enquiry'},{status:400});
 const verification=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY,response:String(d.turnstileToken||''),remoteip:request.headers.get('CF-Connecting-IP')||''})}).then(r=>r.json()).catch(()=>({success:false}));
 if(!verification.success)return Response.json({error:'Security verification failed'},{status:403});
 const name=String(d.name||'').trim(),email=String(d.email||'').trim(),topic=String(d.topic||'').trim(),message=String(d.message||'').trim();
 if(String(d.website||'').trim())return Response.json({ok:true});
 if(name.length<2||name.length>100||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>200||topic.length<2||topic.length>120||message.length<10||message.length>3000)return Response.json({error:'Please check the form fields'},{status:400});
 await env.DB.prepare('INSERT INTO enquiries(id,name,email,topic,message) VALUES(?,?,?,?,?)').bind(crypto.randomUUID(),name,email,topic,message).run();
 return Response.json({ok:true},{status:201});
}
