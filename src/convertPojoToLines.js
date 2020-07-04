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

/**
 * Returns an object with the given values initialised.
 * @param {Number} indent The number of indentations before the content of the line should begin.
 * @param {String} type The type of line, from the lineTypes constants.
 * @param {String} [propertyName] The name of a property, if applicable.
 * @param {String} [propertyValue] The name of a value, if applicable.
 * @param {Boolean} [continuation] True if the property should be concluded with a comma.
 */
function createLine (indent, type, propertyName = null, propertyValue = null, continuation = false) {
  return {
    lineNo: -1,
    indent,
    type,
    propertyName,
    propertyValue,
    continuation
  }
}

/**
 * Converts the given array to a sequence of lines for display.
 * @param {Object} array An array to be converted.
 * @param {Number} [indent] The current indentation level.
 * @param {Boolean} [continuation] True if the last line needs to include a continuation mark.
 */
function convertArrayToLines (array, indent = 0, continuation = false) {
  const lines = []

  lines.push(createLine(indent, LINE_TYPE_ARRAY_OPEN))

  for (let i = 0; i < array.length; i++) {
    const value = array[i]
    const arrayContinuation = i < array.length - 1

    if (Array.isArray(value)) {
      lines.push(...convertArrayToLines(value, indent + 2, arrayContinuation))
    } else if (typeof value === 'object' && value !== null) {
      lines.push(...convertObjectToLines(value, indent + 2, arrayContinuation))
    } else if (typeof value === 'string') {
      lines.push(createLine(indent + 2, LINE_TYPE_STRING, null, value, arrayContinuation))
    } else if (typeof value === 'number') {
      lines.push(createLine(indent + 2, LINE_TYPE_NUMBER, null, value, arrayContinuation))
    } else if (typeof value === 'boolean') {
      lines.push(createLine(indent + 2, LINE_TYPE_BOOLEAN, null, value, arrayContinuation))
    } else if (value === null) {
      lines.push(createLine(indent + 2, LINE_TYPE_NULL, null, value, arrayContinuation))
    } else {
      // ignore values that are a function or undefined
    }
  }

  lines.push(createLine(indent, LINE_TYPE_ARRAY_CLOSE, null, null, continuation))

  return lines
}

/**
 * Converts the given object to a sequence of lines for display.
 * @param {Object} obj An object to be converted.
 * @param {Number} [indent] The current indentation level.
 * @param {Boolean} [continuation] True if the last line needs to include a continuation mark.
 */
function convertObjectToLines (obj, indent = 0, continuation = false) {
  const lines = []

  lines.push(createLine(indent, LINE_TYPE_OBJECT_OPEN))

  const keys = Object.keys(obj)

  for (let i = 0; i < keys.length; i++) {
    const propertyName = keys[i]
    const propertyValue = obj[propertyName]
    const propertiesContinuation = i < keys.length - 1

    if (Array.isArray(propertyValue)) {
      lines.push(createLine(indent + 2, LINE_TYPE_PROPERTY_OPEN, propertyName))
      lines.push(...convertArrayToLines(propertyValue, indent + 2, propertiesContinuation))
    } else if (typeof propertyValue === 'object' && propertyValue !== null) {
      lines.push(createLine(indent + 2, LINE_TYPE_PROPERTY_OPEN, propertyName))
      lines.push(...convertObjectToLines(propertyValue, indent + 2, propertiesContinuation))
    } else if (typeof propertyValue === 'string') {
      lines.push(createLine(indent + 2, LINE_TYPE_STRING_PROPERTY, propertyName, propertyValue, propertiesContinuation))
    } else if (typeof propertyValue === 'number') {
      lines.push(createLine(indent + 2, LINE_TYPE_NUMBER_PROPERTY, propertyName, propertyValue, propertiesContinuation))
    } else if (typeof propertyValue === 'boolean') {
      lines.push(createLine(indent + 2, LINE_TYPE_BOOLEAN_PROPERTY, propertyName, propertyValue, propertiesContinuation))
    } else if (propertyValue === null) {
      lines.push(createLine(indent + 2, LINE_TYPE_NULL_PROPERTY, propertyName, propertyValue, propertiesContinuation))
    } else {
      // ignore properties where the value is a function or undefined
    }
  }

  lines.push(createLine(indent, LINE_TYPE_OBJECT_CLOSE, null, null, continuation))

  return lines
}

/**
 * Converts the given obj parameter to a sequence of lines for display.
 * @param {Any} obj Any JS object.
 */
function convertInputToLines (obj) {
  if (typeof obj === 'string') {
    return [createLine(0, LINE_TYPE_STRING, null, obj)]
  } else if (typeof obj === 'number') {
    return [createLine(0, LINE_TYPE_NUMBER, null, obj)]
  } else if (typeof obj === 'boolean') {
    return [createLine(0, LINE_TYPE_BOOLEAN, null, obj)]
  } else if (obj === null) {
    return [createLine(0, LINE_TYPE_NULL)]
  } else if (typeof obj === 'object' && !Array.isArray(obj)) {
    return convertObjectToLines(obj)
  } else if (Array.isArray(obj)) {
    return convertArrayToLines(obj)
  } else {
    return [] // cannot handle undefineds or functions
  }
}

/**
 * Returns an array of line objects that can be used to produce a display.
 * Each line has a lineNo, indent and a type.  The type dictates whether
 * the propertyName and/or propertyValue properties will be populated.
 *
 * For example: a line with a type of LINE_TYPE_STRING_PROPERTY will
 * have a propertyName and a propertyValue property.
 * @param {Any} obj The object to be converted to an array of lines.
 */
export function convertPojoToLines (obj) {
  const lines = convertInputToLines(obj)
  lines.forEach((line, index) => { line.lineNo = index + 1 })
  return lines
}
