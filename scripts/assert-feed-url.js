const url = process.env.R2_PUBLIC_URL

if (!url) {
  console.error(
    'R2_PUBLIC_URL is missing. GitHub Actions sets this from the repository secret when it runs npm run dist.'
  )
  process.exit(1)
}

let parsed
try {
  parsed = new URL(url)
} catch {
  console.error('R2_PUBLIC_URL must be a valid https address ending with a slash.')
  process.exit(1)
}

if (parsed.protocol !== 'https:' || !url.endsWith('/')) {
  console.error('R2_PUBLIC_URL must be an https address ending with a slash.')
  process.exit(1)
}
