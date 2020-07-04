/**
 * The constants in this file identify the possible types of lines
 * that can appear in a JSON file.
 *
 * All lines may optionally end in a comma, if there is a subsequent line.
 */

// "myString"
export const LINE_TYPE_STRING = 'LINE_TYPE_STRING'

// 1234
export const LINE_TYPE_NUMBER = 'LINE_TYPE_NUMBER'

// true
export const LINE_TYPE_BOOLEAN = 'LINE_TYPE_BOOLEAN'

// null
export const LINE_TYPE_NULL = 'LINE_TYPE_NULL'

// "myProperty": "myString"
export const LINE_TYPE_STRING_PROPERTY = 'LINE_TYPE_STRING_PROPERTY'

// "myProperty": 1234
export const LINE_TYPE_NUMBER_PROPERTY = 'LINE_TYPE_NUMBER_PROPERTY'

// "myProperty": true
export const LINE_TYPE_BOOLEAN_PROPERTY = 'LINE_TYPE_BOOLEAN_PROPERTY'

// "myProperty": null
export const LINE_TYPE_NULL_PROPERTY = 'LINE_TYPE_NULL_PROPERTY'

// "myProperty":
export const LINE_TYPE_PROPERTY_OPEN = 'LINE_TYPE_PROPERTY_OPEN'

// {
export const LINE_TYPE_OBJECT_OPEN = 'LINE_TYPE_OBJECT_OPEN'

// }
export const LINE_TYPE_OBJECT_CLOSE = 'LINE_TYPE_OBJECT_CLOSE'

// [
export const LINE_TYPE_ARRAY_OPEN = 'LINE_TYPE_ARRAY_OPEN'

// ]
export const LINE_TYPE_ARRAY_CLOSE = 'LINE_TYPE_ARRAY_CLOSE'
