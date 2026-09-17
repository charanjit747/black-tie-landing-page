// ============================================================
// cdn.ts — Shared S3/CloudFront asset base URL
//
// Every static asset previously served from public/assets/<folder>/<file>
// now lives at this same path under the CDN instead (folders uploaded
// with identical names/structure) — e.g. public/assets/contact-us/
// globe-dark.png is now `${ASSETS_BASE_URL}/contact-us/globe-dark.png`.
// No trailing slash: every call site appends its own leading "/".
// ============================================================

export const ASSETS_BASE_URL = 'https://d354qrbjihw1mn.cloudfront.net/landingPageAssets';
