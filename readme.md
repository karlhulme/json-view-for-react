# JSON View for React

![](https://github.com/karlhulme/json-view-for-react/workflows/CD/badge.svg)
[![npm](https://img.shields.io/npm/v/json-view-for-react.svg)](https://www.npmjs.com/package/json-view-for-react)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This is a syntax highlighter for a JSON object. It works by walking the object tree..

Most syntax highlighters will render into a PRE and then use regular expressions to find the syntax. This approach works great when you want to support lots of different languages - or anything other than JSON in fact!

I created this component because I wanted a non-trivial test case for exploring what a well behaved reusable component should be. At the time of writing, I think a reusable component is one that:

- Generates semantically valid HTML along with accessibility tags.
- Generates class names where the host can override the prefix (Allowing the host to ensure uniqueness of css names and avoid CSS class name collision).
- Include example CSS within the documentation but not bundled or built into the component.
- Does not rely on storybook or bit etc (Great tools, but shouldn't be needed)

The CSS class names are a pretty important part of this.

If the component does not allow other components to be embedded inside, then CSS class name collision is avoidable. Just use sensible selectors, all will be well.

However, if a component allows you to pass children that can be rendered inside, then the wrapping component must use explicit and prefixed class names.

The screenshot below shows the JSON view with the CSS below applied.

![Screenshot](./screenshot.png)

## Usage

Pass any object to the `obj` property of the `JsonView` component.

You can optionally pass a value to `cssPrefix` to ensure that the css class names don't clash with the ones in your host application. The default value is `jsonview`.

```javascript
import React from "react";
import { JsonView } from "json-view-for-react";

function Example() {
  return (
    <JsonView
      obj={{ hello: "world" }}
      cssPrefix="external_json_view"
      showLineNumbers
      highlightedLineNumbers={[2, 4]}
    />
  );
}
```

| Property Name          | Description                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| obj                    | A JSON object to be displayed.                                                            |
| cssPrefix              | A value to be prefixed before all classNames. A hyphen is added too.                      |
| showLineNumbers        | An optional boolean that indicates if line numbers should be displayed next to each line. |
| highlightedLineNumbers | An array of line numbers that should be displayed highlighted.                            |

### Styling

The component will add classes to all the elements that it creates. Below is an example CSS block that assumes you're using default cssPrefix of `jsonview`.

```css
   <style>
    .jsonview-code {
        display: block;
        padding: 0.5rem;
        background-color: rgb(40, 44, 52);
        color: rgb(136, 198, 190);
        overflow-x: scroll;
        border-radius: 5px;
      }

      .jsonview-line { white-space: nowrap; }
      .jsonview-hi-line { white-space: nowrap; background-color: rgb(80, 80, 95); }

      .jsonview-str { color: rgb(121, 182, 242); }
      .jsonview-num { color: rgb(255, 255, 200); }
      .jsonview-bool { color: rgb(197, 165, 197); }
      .jsonview-null { color: rgb(197, 165, 197); }
      .jsonview-prop { color: rgb(250, 200, 99); }

      .jsonview-ln {
        display: inline-block;
        padding-right: 1rem;
        color: rgb(178, 178, 178);
        text-align: right;
        user-select: none;
      }
   </style>
```

## Development

Run `npm start` to launch a test page with hot reload.

Run `npm test` to run the tests, 100% coverage required to pass.

Run `npm run build` to build the distributable version that can be imported into other react projects.

## Deployment

A push to the master branch triggers Github Actions CI/CD to run.

If the tests run successfully then the library is versioned, released on Github and published in NPM.

The versioning is semantic based on the presence of `--fix`, `--feat` or `--break` within the commit comments since the previous release.

## License

MIT.
