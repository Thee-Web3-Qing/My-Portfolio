// The seven original December API endpoints are served by a single Vercel Function.
// Keep each handler isolated in server/december and preserve all existing URLs through rewrites.
// This reduces Hobby deployment functions without changing Paystack, intake or tracking logic.
import image from '../server/december/image.js'
import initialize from '../server/december/initialize.js'
import intake from '../server/december/intake.js'
import progress from '../server/december/progress.js'
import status from '../server/december/status.js'
import upload from '../server/december/upload.js'
import verify from '../server/december/verify.js'

const routes = Object.freeze({ image, initialize, intake, progress, status, upload, verify })

export default async function handler(req,res) {
  const operation = req.query?.operation
  if (typeof operation !== 'string' || !Object.hasOwn(routes,operation)) {
    res.setHeader('Cache-Control','no-store')
    return res.status(404).json({error:'Unknown December API endpoint'})
  }
  return routes[operation](req,res)
}
