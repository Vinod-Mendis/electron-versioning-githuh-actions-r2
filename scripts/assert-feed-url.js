const url = process.env.FEED_URL

if (!url) {
  console.error(
    'FEED_URL is missing. GitHub Actions sets it from the R2_PUBLIC_URL secret when it runs npm run dist.'
  )
  process.exit(1)
}

let parsed
try {
  parsed = new URL(url)
} catch {
  console.error('FEED_URL must be a valid https address ending with a slash.')
  process.exit(1)
}

if (parsed.protocol !== 'https:' || !url.endsWith('/')) {
  console.error('FEED_URL must be an https address ending with a slash.')
  process.exit(1)
}
