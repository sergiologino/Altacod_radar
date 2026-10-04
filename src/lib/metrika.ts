export const METRIKA_COUNTER_ID = 113399075

type MetrikaCall = [number, string, ...unknown[]]
type MetrikaFunction = ((...args: MetrikaCall) => void) & {
  a?: MetrikaCall[]
  l?: number
}

declare global {
  interface Window {
    ym?: MetrikaFunction
    dataLayer?: unknown[]
  }
}

export function isMetrikaHost(hostname: string) {
  return hostname === 'altacod.com' || hostname === 'www.altacod.com'
}

export function initializeMetrika() {
  if (document.getElementById('yandex-metrika-script')) return

  if (!window.ym) {
    const ym = ((...args: MetrikaCall) => {
      ;(ym.a ||= []).push(args)
    }) as MetrikaFunction
    ym.l = Date.now()
    window.ym = ym
  }

  window.dataLayer ||= []

  const script = document.createElement('script')
  script.id = 'yandex-metrika-script'
  script.async = true
  script.src = `https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_COUNTER_ID}`
  document.head.appendChild(script)

  window.ym(METRIKA_COUNTER_ID, 'init', {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    referrer: document.referrer,
    url: window.location.href,
    accurateTrackBounce: true,
    trackLinks: true,
    defer: true,
  })
}

export function trackMetrikaPageView(url: string, title: string, referer: string) {
  initializeMetrika()
  window.ym?.(METRIKA_COUNTER_ID, 'hit', url, { title, referer })
}
