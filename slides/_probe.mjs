import { chromium } from 'playwright-chromium'

const base = 'http://localhost:3033'
const outDir = process.argv[2] || '.'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })

await page.goto(`${base}/1`, { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
// mimic real interaction: click into the deck and move the mouse around
await page.mouse.click(640, 360)
await page.mouse.move(300, 300)
await page.mouse.move(900, 400)
await page.waitForTimeout(400)

const overlays = await page.evaluate(() => {
  const res = []
  for (const e of document.querySelectorAll('*')) {
    const cs = getComputedStyle(e)
    const r = e.getBoundingClientRect()
    const animated = cs.animationName && cs.animationName !== 'none'
    const fixedOrAbs = cs.position === 'fixed' || cs.position === 'absolute'
    const smallOverlay =
      fixedOrAbs && r.width > 0 && r.height > 0 && r.width < 60 && r.height < 120 &&
      (cs.pointerEvents === 'none' || parseInt(cs.zIndex || '0', 10) > 10)
    if (animated || smallOverlay) {
      res.push({
        tag: e.tagName,
        cls: (e.getAttribute('class') || '').slice(0, 60),
        pos: cs.position,
        z: cs.zIndex,
        animationName: cs.animationName,
        pointerEvents: cs.pointerEvents,
        borderRadius: cs.borderRadius,
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        bg: cs.backgroundColor,
      })
    }
  }
  const ae = document.activeElement
  return {
    activeElement: ae ? { tag: ae.tagName, cls: ae.getAttribute('class') } : null,
    count: res.length,
    items: res.slice(0, 40),
  }
})
console.log(JSON.stringify(overlays, null, 2))

// burst screenshots to catch a blinking caret/cursor (blink ~530ms)
for (let i = 0; i < 5; i++) {
  await page.screenshot({ path: `${outDir}/burst-${i}.png` })
  await page.waitForTimeout(180)
}
await browser.close()
