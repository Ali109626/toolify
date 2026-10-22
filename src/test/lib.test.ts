import { describe, it, expect } from 'vitest'
import { formatBytes } from '../lib/image'
import { countText, convertCase, cleanLines, computeDiff } from '../lib/text'
import { formatJson, minifyJson, encodeBase64, decodeBase64, encodeUrl, decodeUrl, parseQueryParams } from '../lib/dev'
import { calcPercentageOf, calcWhatPercent, calcPercentageChange, calcDiscount, calcAge } from '../lib/calc'

describe('Image Helpers', () => {
  it('formats bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(1024)).toBe('1 KB')
    expect(formatBytes(1048576)).toBe('1 MB')
    expect(formatBytes(5242880)).toBe('5 MB')
  })
})

describe('Text Processing', () => {
  it('counts words and characters accurately', () => {
    const sample = 'Hello world! This is a test sentence. Another one here.'
    const metrics = countText(sample)
    expect(metrics.words).toBe(10)
    expect(metrics.sentences).toBe(3)
    expect(metrics.characters).toBe(sample.length)
    expect(metrics.charactersNoSpaces).toBe(sample.replace(/\s/g, '').length)
  })

  it('converts cases properly', () => {
    expect(convertCase('hello world', 'upper')).toBe('HELLO WORLD')
    expect(convertCase('HELLO WORLD', 'lower')).toBe('hello world')
    expect(convertCase('hello world test', 'title')).toBe('Hello World Test')
    expect(convertCase('hello world test', 'camel')).toBe('helloWorldTest')
    expect(convertCase('hello world test', 'pascal')).toBe('HelloWorldTest')
    expect(convertCase('hello world test', 'snake')).toBe('hello_world_test')
    expect(convertCase('hello world test', 'kebab')).toBe('hello-world-test')
    expect(convertCase('hello world test', 'constant')).toBe('HELLO_WORLD_TEST')
  })

  it('cleans duplicate lines and whitespace', () => {
    const text = 'apple\n  banana  \napple\n\ncherry\n'
    const res = cleanLines(text, {
      removeDuplicates: true,
      trimLines: true,
      collapseSpaces: true,
      removeEmptyLines: true,
      caseSensitive: false,
      sortMode: 'asc',
    })
    expect(res.duplicatesRemoved).toBe(1)
    expect(res.emptyLinesRemoved).toBe(2)
    expect(res.text).toBe('apple\nbanana\ncherry')
  })

  it('computes diff accurately', () => {
    const diff = computeDiff('hello world', 'hello brave new world', 'words')
    expect(diff.additions).toBeGreaterThan(0)
  })
})

describe('Developer Tools', () => {
  it('formats valid JSON and handles errors', () => {
    const valid = '{"b":2,"a":1}'
    const formatted = formatJson(valid, 2, true)
    expect(formatted.success).toBe(true)
    expect(formatted.formatted).toContain('"a": 1')

    const invalid = '{"a": 1,}'
    const err = formatJson(invalid)
    expect(err.success).toBe(false)
    expect(err.error).toBeDefined()
  })

  it('minifies JSON', () => {
    const input = '{\n  "name": "test",\n  "count": 42\n}'
    const min = minifyJson(input)
    expect(min.success).toBe(true)
    expect(min.minified).toBe('{"name":"test","count":42}')
  })

  it('encodes and decodes Base64 with UTF-8 support', () => {
    const original = 'Hello World! 🚀 Café'
    const encoded = encodeBase64(original)
    const decoded = decodeBase64(encoded)
    expect(decoded.success).toBe(true)
    expect(decoded.decoded).toBe(original)
  })

  it('encodes and decodes URLs and parses query params', () => {
    const url = 'https://example.com/search?q=online tools&category=pdf#results'
    const params = parseQueryParams(url)
    expect(params).toHaveLength(2)
    expect(params[0]).toEqual({ key: 'q', value: 'online tools' })
    expect(params[1]).toEqual({ key: 'category', value: 'pdf' })

    const encoded = encodeUrl('hello world & symbols')
    expect(decodeUrl(encoded).decoded).toBe('hello world & symbols')
  })
})

describe('Calculators', () => {
  it('calculates percentage modes', () => {
    expect(calcPercentageOf(20, 200)).toBe(40)
    expect(calcWhatPercent(50, 200)).toBe(25)
    const change = calcPercentageChange(100, 150)
    expect(change.percentChange).toBe(50)
    expect(change.isIncrease).toBe(true)
  })

  it('calculates discounts and tax', () => {
    const res = calcDiscount(100, 20, true, 10, 5)
    // 100 - 20 = 80; coupon 10% of 80 = 8 => 72; tax 5% of 72 = 3.6 => 75.6
    expect(res.primaryDiscountAmount).toBe(20)
    expect(res.couponDiscountAmount).toBe(8)
    expect(res.finalPrice).toBeCloseTo(75.6, 2)
  })

  it('calculates exact age and handles invalid inputs', () => {
    const age = calcAge('2000-01-01', '2025-01-01')
    expect(age).not.toBeNull()
    if (age) {
      expect(age.years).toBe(25)
      expect(age.months).toBe(0)
      expect(age.days).toBe(0)
    }

    expect(calcAge('invalid-date')).toBeNull()
  })
})
