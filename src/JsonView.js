import React from 'react'
import PropTypes from 'prop-types'
import { convertPojoToLines } from './convertPojoToLines'

import {
  LINE_TYPE_STRING,
  LINE_TYPE_NUMBER,
  LINE_TYPE_BOOLEAN,
  LINE_TYPE_NULL,
  LINE_TYPE_STRING_PROPERTY,
  LINE_TYPE_NUMBER_PROPERTY,
  LINE_TYPE_BOOLEAN_PROPERTY,
  LINE_TYPE_NULL_PROPERTY,
  LINE_TYPE_PROPERTY_OPEN,
  LINE_TYPE_OBJECT_OPEN,
  LINE_TYPE_OBJECT_CLOSE,
  LINE_TYPE_ARRAY_OPEN,
  LINE_TYPE_ARRAY_CLOSE
} from './lineTypes'

import {
  CODE,
  LINE,
  STRING_VALUE,
  NUMBER_VALUE,
  BOOLEAN_VALUE,
  NULL_VALUE,
  PROPERTY_NAME,
  LINE_NUMBER
} from './contentTypes'

/**
 * Creates an element using either the provided function or by using
 * the default elements.
 * @param {String} contentType The type of content that the element will contain.
 * @param {Object} content The content of the element.
 * @param {Number} key This value is required for the LINE element.  For all other elements
 * this value should be null.
 * @param {Function} [onCreateElement] An optional function that creates an element.
 */
function createElement (contentType, content, key, onCreateElement) {
  let element = null

  if (onCreateElement) {
    element = onCreateElement(contentType, content)
  }

  if (!React.isValidElement(element)) {
    switch (contentType) {
      case CODE: return <code className='json-view-for-react'>{content}</code>
      case LINE: return <div className='line' key={key}>{content}</div>
      case STRING_VALUE: return <span className='str'>{content}</span>
      case NUMBER_VALUE: return <span className='num'>{content}</span>
      case BOOLEAN_VALUE: return <span className='bool'>{content}</span>
      case NULL_VALUE: return <span className='null'>{content}</span>
      case PROPERTY_NAME: return <span className='prop'>{content}</span>
      case LINE_NUMBER: return <span className='ln'>{content}</span>
      /* istanbul ignore next */ // There is no case for getting an unrecognised contentType here.
      default: return <span>{content}</span>
    }
  }

  return element
}

/**
 * Converts the description of a line (as described by a line object) into a React fragment
 * that contains zero or more span elements.
 * @param {Object} line An object that has lineNo, type, propertyName and/or propertyValue properties
 * that describes a line of JSON code.
 * @param {Function} [onCreateElement] An optional function that can create an element.
 */
function convertLineToCodeLineContent (line, onCreateElement) {
  // curry the span creator to reduce the length of the lines below
  const fnElem = (contentType, content) => createElement(contentType, content, null, onCreateElement)

  const cont = line.continuation ? ',' : ''

  switch (line.type) {
    case LINE_TYPE_STRING: return <>{fnElem(STRING_VALUE, `"${line.propertyValue}"`)}{cont}</>
    case LINE_TYPE_NUMBER: return <>{fnElem(NUMBER_VALUE, line.propertyValue.toString())}{cont}</>
    case LINE_TYPE_BOOLEAN: return <>{fnElem(BOOLEAN_VALUE, line.propertyValue ? 'true' : 'false')}{cont}</>
    case LINE_TYPE_NULL: return <>{fnElem(NULL_VALUE, 'null')}{cont}</>
    case LINE_TYPE_STRING_PROPERTY: return <>{fnElem(PROPERTY_NAME, `"${line.propertyName}"`)}: {fnElem(STRING_VALUE, `"${line.propertyValue}"`)}{cont}</>
    case LINE_TYPE_NUMBER_PROPERTY: return <>{fnElem(PROPERTY_NAME, `"${line.propertyName}"`)}: {fnElem(NUMBER_VALUE, line.propertyValue.toString())}{cont}</>
    case LINE_TYPE_BOOLEAN_PROPERTY: return <>{fnElem(PROPERTY_NAME, `"${line.propertyName}"`)}: {fnElem(BOOLEAN_VALUE, line.propertyValue ? 'true' : 'false')}{cont}</>
    case LINE_TYPE_NULL_PROPERTY: return <>{fnElem(PROPERTY_NAME, `"${line.propertyName}"`)}: {fnElem(NULL_VALUE, 'null')}{cont}</>
    case LINE_TYPE_PROPERTY_OPEN: return <>{fnElem(PROPERTY_NAME, `"${line.propertyName}"`)}:</>
    case LINE_TYPE_OBJECT_OPEN: return <>{'{'}</>
    case LINE_TYPE_OBJECT_CLOSE: return <>{'}'}{cont}</>
    case LINE_TYPE_ARRAY_OPEN: return <>[</>
    case LINE_TYPE_ARRAY_CLOSE: return <>]{cont}</>
    /* istanbul ignore next */ // There is no case for getting an unrecognised line.type here.
    default: return null
  }
}

/**
 * A syntax-highlighted view of a JSON object.
 * @param {Object} props A property bag.
 * @param {Object} props.obj A JSON object to be displayed.
 * @param {Boolean} [props.showLineNumbers] An optional boolean that indicates if line
 * numbers should be displayed next to each line.
 * @param {Function} [props.onCreateElement] An optional function (contentType, content, key, jsonCodeInfo) that
 * can return a bespoke element for any given contentType rather than use the defaults.
 * If the function does not return a value that satisfies React.isValidElement then the
 * default will be used instead.  So you don't have to support every contentType value.
 */
export function JsonView ({ obj, showLineNumbers = false, onCreateElement = null }) {
  const lines = convertPojoToLines(obj)

  const lineNoCharCount = lines.length.toString().length

  const codeLines = lines.map((line, index) => {
    const lineNoText = line.lineNo.toString().padStart(lineNoCharCount, '\u00a0')
    const lineNoSpan = showLineNumbers ? createElement(LINE_NUMBER, lineNoText, null, onCreateElement) : ''
    const spaces = '\u00a0'.repeat(line.indent)
    const lineContent = convertLineToCodeLineContent(line, onCreateElement)

    return createElement(LINE, <>{lineNoSpan}{spaces}{lineContent}</>, index, onCreateElement)
  })

  return createElement(CODE, codeLines, null, onCreateElement)
}

JsonView.propTypes = {
  obj: PropTypes.any,
  showLineNumbers: PropTypes.bool,
  onCreateElement: PropTypes.func
}
