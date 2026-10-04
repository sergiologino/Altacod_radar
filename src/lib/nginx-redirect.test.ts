import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('legacy product URLs', () => {
  it('redirects old app links to the catalog while preserving path and query', () => {
    const nginx = readFileSync('nginx.conf', 'utf8')

    expect(nginx).toMatch(
      /location \^~ \/apps\/\s*\{\s*return 308 https:\/\/products\.altacod\.com\$request_uri;/,
    )
  })
})
