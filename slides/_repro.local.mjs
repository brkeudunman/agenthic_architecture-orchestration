import http from 'node:http'
import sirv from 'sirv'
import { chromium } from 'playwright-chromium'

const BASE = '/agenthic_architecture-orchestration/'
const distDir = process.argv[2]
const serve = sirv(distDir, { single: true, dev: false })

const server = http.createServer((req, res) => {
  if (req.url.startsWith(BASE)) {
    req.url = req.url.slice(BASE.length - 1) // keep leading slash
    if (req.url === '') req.url = '/'
  } else if (req.url === BASE.slice(0, -1)) {
    res.writeHead(302, { Location: BASE }); res.end(); return
  }
  serve(req, res)
})

await new Promise((r) => server.listen(0, r))
const port = server.address().port
const origin = `http://localhost:${port}`
console.log('serving', distDir, 'at', origin + BASE)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
const log = []
page.on('console', (m) => { if (m.type() === 'error') log.push('PAGE ERROR: ' + m.text()) })

await page.goto(origin + BASE, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
console.log('after load   :', await page.evaluate(() => location.href))

for (let i = 1; i <= 3; i++) {
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(700)
  console.log(`after Right ${i}:`, await page.evaluate(() => location.href))
}

if (log.length) console.log('--- page errors ---\n' + log.join('\n'))
await browser.close()
await new Promise((r) => server.close(r))
