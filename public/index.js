import React from 'react'
import { render } from 'react-dom'
import { JsonView, CODE } from '../src'

const exampleObject = {
  a: 'valueA',
  b: 123,
  c: true,
  d: null,
  e: {
    f: 'valueF - this is a very long value to trigger horizontal scrolling on small screens.',
    g: '234',
    h: [
      { i: 'valueI', j: 'valueJ' },
      345,
      null,
      () => { return 'ignorable function' },
      [true, false, null]
    ],
    k: undefined
  }
}

const codeStyle = {
  display: 'block',
  padding: '0.5rem',
  backgroundColor: 'rgb(40, 44, 52)',
  color: 'rgb(136, 198, 190)',
  overflowX: 'scroll',
  borderRadius: '5px'
}

function onCreateElement (contentType, content) {
  if (contentType === CODE) {
    return <code className='json-view-for-react' style={codeStyle}>{content}</code>
  }
}

render(<JsonView obj={exampleObject} showLineNumbers highlightedLineNumbers={[2, 3, 4]} onCreateElement={onCreateElement} />, document.getElementById('root'))
