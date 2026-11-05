import {createRemoteJWKSet,jwtVerify} from 'jose';
export async function verifyAdmin(request,env){
 const token=request.headers.get('Cf-Access-Jwt-Assertion');
 if(!token||!env.CF_ACCESS_TEAM_DOMAIN||!env.CF_ACCESS_AUD||!env.ADMIN_EMAILS)return false;
 try{
  const issuer='https://'+env.CF_ACCESS_TEAM_DOMAIN.replace(/^https?:\/\//,'').replace(/\/$/,'');
  const jwks=createRemoteJWKSet(new URL(issuer+'/cdn-cgi/access/certs'));
  const {payload}=await jwtVerify(token,jwks,{issuer,audience:env.CF_ACCESS_AUD});
  const email=String(payload.email||'').toLowerCase();
  const allowed=env.ADMIN_EMAILS.split(',').map(s=>s.trim().toLowerCase());
  return !!email&&allowed.includes(email);
 }catch{return false}
}
