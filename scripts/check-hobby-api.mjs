// CI guard for the Vercel Hobby 12-function limit and December route compatibility.
// This makes deployment-limit regressions fail the build before Vercel runs.
import { readdir, readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import december from '../api/december.js'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const filePaths = []
async function enumerate(dir, prefix = '') {
 for (const item of await readdir(dir,{withFileTypes:true})) {
  if (item.name.startsWith('_')) continue
  const rel=join(prefix,item.name)
  if (item.isDirectory()) await enumerate(join(dir,item.name),rel)
  else if (item.isFile() && /\.(?:js|mjs|ts)$/.test(item.name)) filePaths.push(rel)
 }
}
await enumerate(join(root,'api'))
if (filePaths.length > 12) throw new Error('Vercel Hobby API count exceeded: '+filePaths.length+' > 12')
if (filePaths.length!==11) throw new Error('Expected eleven API functions including workflow checkout; found '+filePaths.length)

const vercel=JSON.parse(await readFile(join(root,'vercel.json'),'utf8'))
const operations = {image:'POST',initialize:'GET',intake:'GET',progress:'POST',reminders:'DELETE',status:'POST',upload:'GET',verify:'POST'}
for (const [operation,method] of Object.entries(operations)) {
 const source='/api/december/'+operation
 const rewrite=vercel.rewrites?.find(entry=>entry.source===source)
 if (rewrite?.destination !== '/api/december?operation='+operation) {
  throw new Error('December rewrite missing or invalid: '+source)
 }
 const req={method,query:{operation},headers:{}}
 const res={
  code:0,
  setHeader(){return this},
  status(code){this.code=code;return this},
  json(){return this},
  end(){return this}
 }
 await december(req,res)
 if (res.code!==405) throw new Error(source+' did not preserve method validation; got '+res.code)
}
const missing={method:'GET',query:{operation:'unknown'},headers:{}}
const unknown={code:0,setHeader(){return this},status(code){this.code=code;return this},json(){return this}}
await december(missing,unknown)
if(unknown.code!==404) throw new Error('Unknown API operations must fail closed')
console.log('Verified '+filePaths.length+' serverless API routes, all eight December rewrites, and handler method checks.')
