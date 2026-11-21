// Ensure private SPA entrypoints can resolve as real static pages with Vercel cleanUrls.
// These pages intentionally stay out of the public sitemap and search indexing.
import {readFile,stat} from 'node:fs/promises'
import {join} from 'node:path'
const routes=['admin','december/track','december/details','payment/callback']
const cfg=JSON.parse(await readFile('vercel.json','utf8'))
for(const route of routes){
 const path=join('dist',route+'.html')
 const size=(await stat(path)).size
 const content=await readFile(path,'utf8')
 if(size<200||!content.includes('<title>')||!content.includes('noindex')||!content.includes('<div id="root"></div>')){
  throw new Error('Private SPA entrypoint did not render correctly: '+path)
 }
 if(cfg.rewrites.some(r=>r.source==='/'+route)){
  throw new Error('Private SPA entrypoint incorrectly overwritten by rewrite: /'+route)
 }
}
console.log('Verified four private website and Paystack callback entrypoint files.')
