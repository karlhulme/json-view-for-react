/* eslint-env jest */
import React from 'react'
import { render } from '@testing-library/react'
import { JsonView } from './JsonView'
import { CODE } from './contentTypes'

test('should render undefined', async () => {
  const { container } = render(<JsonView obj={undefined} />)
  expect(container.firstElementChild.tagName).toEqual('CODE')
  expect(container.firstElementChild.childElementCount).toEqual(0)
})

test('should render null', async () => {
  const { getByText } = render(<JsonView obj={null} />)
  expect(getByText(/null/).className).toEqual(expect.stringContaining('null'))
})

test('should render a string', async () => {
  const { getByText } = render(<JsonView obj='raw string' />)
  expect(getByText(/raw string/).className).toEqual(expect.stringContaining('str'))
})

test('should render a number', async () => {
  const { getByText } = render(<JsonView obj={45} />)
  expect(getByText(/45/).className).toEqual(expect.stringContaining('num'))
})

test('should render a true boolean', async () => {
  const { getByText } = render(<JsonView obj={false} />)
  expect(getByText(/false/).className).toEqual(expect.stringContaining('bool'))
})

test('should render a true boolean', async () => {
  const { getByText } = render(<JsonView obj />) // shorthand for obj=true
  expect(getByText(/true/).className).toEqual(expect.stringContaining('bool'))
})

test('should render a string property on an object', async () => {
  const { getByText } = render(<JsonView obj={{ hello: 'world' }} />)
  expect(getByText(/"hello"/).className).toEqual(expect.stringContaining('prop'))
  expect(getByText(/"world"/).className).toEqual(expect.stringContaining('str'))
})

test('should render a number property on an object', async () => {
  const { getByText } = render(<JsonView obj={{ age: 25 }} />)
  expect(getByText(/"age"/).className).toEqual(expect.stringContaining('prop'))
  expect(getByText(/25/).className).toEqual(expect.stringContaining('num'))
})

test('should render a boolean property on an object', async () => {
  const { getByText } = render(<JsonView obj={{ active: true, lastValue: false }} />)
  expect(getByText(/"active"/).className).toEqual(expect.stringContaining('prop'))
  expect(getByText(/true/).className).toEqual(expect.stringContaining('bool'))
  expect(getByText(/"lastValue"/).className).toEqual(expect.stringContaining('prop'))
  expect(getByText(/false/).className).toEqual(expect.stringContaining('bool'))
})

test('should render a null property on an object', async () => {
  const { getByText } = render(<JsonView obj={{ value: null }} />)
  expect(getByText(/"value"/).className).toEqual(expect.stringContaining('prop'))
  expect(getByText(/null/).className).toEqual(expect.stringContaining('null'))
})

test('should not render a function property on an object', async () => {
  const { queryByText } = render(<JsonView obj={{ myAction: () => {} }} />)
  expect(queryByText(/myAction/)).toEqual(null)
})

test('should render a complex object with highlighted lines', async () => {
  const complexObj = {
    valueA: 12,
    valueB: 'some-value',
    subObj: {
      valueC: true,
      innerArray: [25, 26, false]
    },
    subArray: [
      35,
      37,
      { innerObj: 'is-here' }
    ]
  }

  const { getByText } = render(<JsonView obj={complexObj} highlightedLineNumbers={[2, 4]} />)

  expect(getByText(/"valueA"/).className).toEqual(expect.stringContaining('prop'))
  expect(getByText(/"valueB"/).className).toEqual(expect.stringContaining('prop'))
  expect(getByText(/"subObj"/).className).toEqual(expect.stringContaining('prop'))
  expect(getByText(/"valueC"/).className).toEqual(expect.stringContaining('prop'))
  expect(getByText(/"innerArray"/).className).toEqual(expect.stringContaining('prop'))
  expect(getByText(/"subArray"/).className).toEqual(expect.stringContaining('prop'))
  expect(getByText(/"innerObj"/).className).toEqual(expect.stringContaining('prop'))

  expect(getByText(/12/).className).toEqual(expect.stringContaining('num'))
  expect(getByText(/some-value/).className).toEqual(expect.stringContaining('str'))
  expect(getByText(/true/).className).toEqual(expect.stringContaining('bool'))
  expect(getByText(/25/).className).toEqual(expect.stringContaining('num'))
  expect(getByText(/26/).className).toEqual(expect.stringContaining('num'))
  expect(getByText(/35/).className).toEqual(expect.stringContaining('num'))
  expect(getByText(/37/).className).toEqual(expect.stringContaining('num'))
  expect(getByText(/is-here/).className).toEqual(expect.stringContaining('str'))
})

test('should render a bespoke SAMP element in place of the normal CODE element using the onCreateElement function', async () => {
  const onCreateElement = (contentType, content) => {
    if (contentType === CODE) {
      return <samp>{content}</samp>
    }
  }

  const { container } = render(<JsonView obj={{ hello: 'world' }} onCreateElement={onCreateElement} />)
  expect(container.firstElementChild.tagName).toEqual('SAMP')
  // <samp>
  //  <div>{</div>
  //   <div>  "hello": "world"</div>
  //  <div>}</div>
  // </samp>
  expect(container.firstElementChild.childElementCount).toEqual(3)
})

test('should render line numbers', async () => {
  const { getByText } = render(<JsonView obj={{ active: true }} showLineNumbers />)
  expect(getByText(/1/).className).toEqual(expect.stringContaining('ln'))
  expect(getByText(/2/).className).toEqual(expect.stringContaining('ln'))
  expect(getByText(/3/).className).toEqual(expect.stringContaining('ln'))
})

test('should render spans for unrecognised content', async () => {
  const { getByText } = render(<JsonView obj={{ active: true }} showLineNumbers />)
  expect(getByText(/1/).className).toEqual(expect.stringContaining('ln'))
  expect(getByText(/2/).className).toEqual(expect.stringContaining('ln'))
  expect(getByText(/3/).className).toEqual(expect.stringContaining('ln'))
})
