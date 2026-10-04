export function setCanonicalUrl(siteUrl?: string, pathname = '/') {
  const origin = siteUrl?.trim() || window.location.origin
  const canonical = new URL(pathname, origin).toString()
  const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  const ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]')
  const ogImage = document.querySelector<HTMLMetaElement>('meta[property="og:image"]')
  if (link) link.href = canonical
  if (ogUrl) ogUrl.content = canonical
  if (ogImage) ogImage.content = new URL('/og-card.png', canonical).toString()
  return canonical
}

export function setPageMetadata(
  title: string,
  description: string,
  pathname: string,
  siteUrl?: string,
) {
  document.title = title
  const descriptionTag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')
  const ogDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]')
  if (descriptionTag) descriptionTag.content = description
  if (ogTitle) ogTitle.content = title
  if (ogDescription) ogDescription.content = description
  return setCanonicalUrl(siteUrl, pathname)
}
