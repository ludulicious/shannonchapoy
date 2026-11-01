import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import test from 'node:test'
import ts from 'typescript'

const require = createRequire(import.meta.resolve('nuxt/package.json'))
const { parse, compileScript } = require('@vue/compiler-sfc')
const { createSSRApp } = require('vue')
const { renderToString } = require('@vue/server-renderer')

const source = await readFile(new URL('../app/components/CatalogProductSummary.vue', import.meta.url), 'utf8')
const { descriptor } = parse(source)
const compiled = compileScript(descriptor, { id: 'catalog-summary', inlineTemplate: true })
const { outputText } = ts.transpileModule(compiled.content, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
})
const componentModule = { exports: {} }
new Function('require', 'module', 'exports', outputText)(require, componentModule, componentModule.exports)
const render = (props) => renderToString(createSSRApp(componentModule.exports.default, props))

test('summary renders portal Markdown HTML as semantic formatting and preserves links and lists', async () => {
  const html = await render({
    summary: '**Your relationship** with *yourself*',
    summaryHtml:
      '<p><strong>Your relationship</strong> with <em>yourself</em></p><ul><li>Reconnect</li></ul><p><a href="https://example.test">Learn more</a></p>'
  })
  assert.match(html, /<strong>Your relationship<\/strong>/)
  assert.match(html, /<em>yourself<\/em>/)
  assert.match(html, /<ul><li>Reconnect<\/li><\/ul>/)
  assert.match(html, /<a href="https:\/\/example.test">Learn more<\/a>/)
  assert.equal(html.includes('**'), false)
})

test('missing or empty summary HTML falls back to escaped text', async () => {
  for (const summaryHtml of [undefined, '']) {
    const html = await render({ summary: '<script>alert(1)</script>', summaryHtml })
    assert.match(html, /&lt;script&gt;/)
    assert.equal(html.includes('<script>'), false)
  }
})
