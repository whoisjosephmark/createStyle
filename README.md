# createStyle

createStyle is a simple utility for creating reusable styled React components focused around CSS classes rather than discrete styles.

It works great for Tailwind based styling frameworks and offers a fast way to stand up a pure component without the heaviness of delivering a full React component.

Basically it's `styled-components` for Tailwind.

Obviously it's built in Typescript and has both ES Modules and CJS support.

## Installation

To use `createStyle` in your project, simply install it with npm or your preferred package manager.

```bash
npm install @josephmark/createstyle
```

## Basic usage

```tsx
import createStyle from "@josephmark/createstyle"

const H1 = createStyle("h1", "text-lg font-serif leading-[1.5]")
const P = createStyle("p", "tracking-wide")

const Header = () => (
  <header>
    <H1 className="mb-5">createStyle saved my bacon!</H1>
    <figure>
      <P as="blockquote">
        createStyle is a must-have utility for any developer who wants to create
        components with Tailwind. Whether you're working on a small project or a
        large-scale application, CreateStyle makes it easy to create and manage
        your styles, saving you time and headaches in the process.
      </P>
      <P as="cite" className="opacity-50">
        - chatGPT
      </P>
    </figure>
  </header>
)
```

## API

`createStyle(defaultTag, classes, defaultProps)`

`createStyle` is a function that accepts three arguments

1. Default Tag (required) - the semantic HTML tag you want in the DOM whenever you use this element (this can be overwritten later)
2. Classes (optional) - the CSS class names you want applied to the element by default (these can be appended to later)
3. Default Props (optional) - tag props you want to set on the element other than class, including display name (for devtools)

The function returns a React component with `forwardRef`.

## Advanced Usage

### Using Generics

```ts
import createStyle from "@josephmark/createstyle"

const Button = createStyle<HTMLButtonElement>(
  "button",
  "rounded-full bg-red-500 text-white"
)
```

### Display name

```ts
import createStyle from "@josephmark/createstyle"

const Card = createStyle("article", "rounded p-2 bg-white shadow-lg", {
  displayName: "Card",
})
```

### Default Props

```ts
import createStyle from "@josephmark/createstyle"

const Checkbox = createStyle("input", "rounded bg-white border border-black", {
  type: "checkbox",
})
```

### Dynamic classes

```tsx
import createStyle from "@josephmark/createstyle"
import clsx from "clsx"

const TogglerEl = createStyle("button", "rounded py-2 px-4", { type: "button" })

const Toggler = () => {
  const [isToggled, setIsToggled] = useState(false)

  // Classes added during render are appended to the styled element
  return (
    <TogglerEl
      className={clsx(isToggled ? "bg-red-500" : "bg-blue-500")}
      onClick={() => setIsToggled((t) => !t)}
    >
      Toggle me!
    </TogglerEl>
  )
}
```

### Using Refs

```tsx
import { useRef } from "react"
import createStyle from "@josephmark/createstyle"

const Container = createStyle<HTMLDivElement>("div", "max-w-screen-xl mx-auto")

const MyComponent = () => {
  const ref = useRef<HTMLDivElement>(null)

  return <Container ref={ref} />
}
```
