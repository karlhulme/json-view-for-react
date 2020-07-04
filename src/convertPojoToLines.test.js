/* eslint-env jest */
import { convertPojoToLines } from './convertPojoToLines'

test('Convert a string to lines', () => {
  expect(convertPojoToLines('myString')).toEqual([
    { lineNo: 1, indent: 0, type: 'LINE_TYPE_STRING', propertyName: null, propertyValue: 'myString', continuation: false }
  ])
})

test('Convert a number to lines', () => {
  expect(convertPojoToLines(1234)).toEqual([
    { lineNo: 1, indent: 0, type: 'LINE_TYPE_NUMBER', propertyName: null, propertyValue: 1234, continuation: false }
  ])
})

test('Convert a boolean to lines', () => {
  expect(convertPojoToLines(true)).toEqual([
    { lineNo: 1, indent: 0, type: 'LINE_TYPE_BOOLEAN', propertyName: null, propertyValue: true, continuation: false }
  ])
})

test('Convert a null to lines', () => {
  expect(convertPojoToLines(null)).toEqual([
    { lineNo: 1, indent: 0, type: 'LINE_TYPE_NULL', propertyName: null, propertyValue: null, continuation: false }
  ])
})

test('Convert an non-JSON to empty lines', () => {
  expect(convertPojoToLines()).toEqual([])
  expect(convertPojoToLines(() => {})).toEqual([])
})

test('Convert a simple object to lines', () => {
  expect(convertPojoToLines({ a: 'aa', b: 22, c: false, d: () => {}, e: undefined, f: null })).toEqual([
    { lineNo: 1, indent: 0, type: 'LINE_TYPE_OBJECT_OPEN', propertyName: null, propertyValue: null, continuation: false },
    { lineNo: 2, indent: 2, type: 'LINE_TYPE_STRING_PROPERTY', propertyName: 'a', propertyValue: 'aa', continuation: true },
    { lineNo: 3, indent: 2, type: 'LINE_TYPE_NUMBER_PROPERTY', propertyName: 'b', propertyValue: 22, continuation: true },
    { lineNo: 4, indent: 2, type: 'LINE_TYPE_BOOLEAN_PROPERTY', propertyName: 'c', propertyValue: false, continuation: true },
    { lineNo: 5, indent: 2, type: 'LINE_TYPE_NULL_PROPERTY', propertyName: 'f', propertyValue: null, continuation: false },
    { lineNo: 6, indent: 0, type: 'LINE_TYPE_OBJECT_CLOSE', propertyName: null, propertyValue: null, continuation: false }
  ])
})

test('Convert a simple array to lines', () => {
  expect(convertPojoToLines(['a', 1234, true, undefined, () => {}, null, []])).toEqual([
    { lineNo: 1, indent: 0, type: 'LINE_TYPE_ARRAY_OPEN', propertyName: null, propertyValue: null, continuation: false },
    { lineNo: 2, indent: 2, type: 'LINE_TYPE_STRING', propertyName: null, propertyValue: 'a', continuation: true },
    { lineNo: 3, indent: 2, type: 'LINE_TYPE_NUMBER', propertyName: null, propertyValue: 1234, continuation: true },
    { lineNo: 4, indent: 2, type: 'LINE_TYPE_BOOLEAN', propertyName: null, propertyValue: true, continuation: true },
    { lineNo: 5, indent: 2, type: 'LINE_TYPE_NULL', propertyName: null, propertyValue: null, continuation: true },
    { lineNo: 6, indent: 2, type: 'LINE_TYPE_ARRAY_OPEN', propertyName: null, propertyValue: null, continuation: false },
    { lineNo: 7, indent: 2, type: 'LINE_TYPE_ARRAY_CLOSE', propertyName: null, propertyValue: null, continuation: false },
    { lineNo: 8, indent: 0, type: 'LINE_TYPE_ARRAY_CLOSE', propertyName: null, propertyValue: null, continuation: false }
  ])
})

test('Convert an object containing an array', () => {
  const testObj = {
    a: ['a', 2]
  }

  expect(convertPojoToLines(testObj)).toEqual([
    { lineNo: 1, indent: 0, type: 'LINE_TYPE_OBJECT_OPEN', propertyName: null, propertyValue: null, continuation: false },
    { lineNo: 2, indent: 2, type: 'LINE_TYPE_PROPERTY_OPEN', propertyName: 'a', propertyValue: null, continuation: false },
    { lineNo: 3, indent: 2, type: 'LINE_TYPE_ARRAY_OPEN', propertyName: null, propertyValue: null, continuation: false },
    { lineNo: 4, indent: 4, type: 'LINE_TYPE_STRING', propertyName: null, propertyValue: 'a', continuation: true },
    { lineNo: 5, indent: 4, type: 'LINE_TYPE_NUMBER', propertyName: null, propertyValue: 2, continuation: false },
    { lineNo: 6, indent: 2, type: 'LINE_TYPE_ARRAY_CLOSE', propertyName: null, propertyValue: null, continuation: false },
    { lineNo: 7, indent: 0, type: 'LINE_TYPE_OBJECT_CLOSE', propertyName: null, propertyValue: null, continuation: false }
  ])
})

test('Convert an array containing an object', () => {
  const testObj = [
    111,
    true,
    {
      a: 'aaa',
      b: null
    }
  ]

  expect(convertPojoToLines(testObj)).toEqual([
    { lineNo: 1, indent: 0, type: 'LINE_TYPE_ARRAY_OPEN', propertyName: null, propertyValue: null, continuation: false },
    { lineNo: 2, indent: 2, type: 'LINE_TYPE_NUMBER', propertyName: null, propertyValue: 111, continuation: true },
    { lineNo: 3, indent: 2, type: 'LINE_TYPE_BOOLEAN', propertyName: null, propertyValue: true, continuation: true },
    { lineNo: 4, indent: 2, type: 'LINE_TYPE_OBJECT_OPEN', propertyName: null, propertyValue: null, continuation: false },
    { lineNo: 5, indent: 4, type: 'LINE_TYPE_STRING_PROPERTY', propertyName: 'a', propertyValue: 'aaa', continuation: true },
    { lineNo: 6, indent: 4, type: 'LINE_TYPE_NULL_PROPERTY', propertyName: 'b', propertyValue: null, continuation: false },
    { lineNo: 7, indent: 2, type: 'LINE_TYPE_OBJECT_CLOSE', propertyName: null, propertyValue: null, continuation: false },
    { lineNo: 8, indent: 0, type: 'LINE_TYPE_ARRAY_CLOSE', propertyName: null, propertyValue: null, continuation: false }
  ])
})
