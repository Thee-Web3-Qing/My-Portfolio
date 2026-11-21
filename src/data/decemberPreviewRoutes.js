import { INDUSTRIES, LAYOUTS } from './december.js'

/**
 * Each finished industry interface will be built as its own page.
 * Expected public routes are /{industry}{type}, e.g. /fashioneditorial.
 * Until the independently built interfaces replace the placeholders,
 * routes show the existing illustrative sample pages.
 *
 * When a standalone interface is completed, remove its placeholder route
 * in App.jsx and add the new component there. Then add its slug below.
 */
export const FINISHED_PREVIEWS = new Set(['fashioneditorial','fashioncatalogue','fashionminimal','foodeditorial','foodcatalogue','foodminimal'])

export const PREVIEW_ROUTES = Object.fromEntries(INDUSTRIES.map(industry => [
  industry.id, Object.fromEntries(LAYOUTS.map(style => [
    style.id, {
      url:'/'+industry.id+style.id,
      slug:industry.id+style.id,
      status:FINISHED_PREVIEWS.has(industry.id+style.id)?'ready':'sample',
      industry:industry.id,
      layout:style.id,
      description:style.description,
    },
  ])),
]))

export function getPreviewRoute(industry, layout) {
  return PREVIEW_ROUTES[industry]?.[layout] || PREVIEW_ROUTES.fashion.editorial
}
