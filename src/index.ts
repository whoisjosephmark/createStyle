import {
  AllHTMLAttributes,
  createElement,
  ElementType as ReactElementType,
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react"

type ElementType =
  | HTMLDivElement
  | HTMLAnchorElement
  | HTMLFormElement
  | HTMLButtonElement
  | HTMLDListElement
  | HTMLDataElement
  | HTMLElement

/** Readable label for a tag or component, used for the devtools display name. */
function tagName(tag: ReactElementType): string {
  if (typeof tag === "string") {
    return tag
  }
  return (
    (tag as { displayName?: string }).displayName ||
    (tag as { name?: string }).name ||
    "Component"
  )
}

/**
 * Props accepted by any component created with `createStyle` at render time.
 * Extends the element's standard HTML attributes with an `as` override.
 *
 * @template T - The underlying HTML element type (e.g. `HTMLButtonElement`).
 */
export type CustomTagArgs<T = ElementType> = {
  /**
   * Swap what gets rendered at runtime without redefining the component.
   * Accepts an intrinsic tag name (`"h1"`) or any React component
   * (`Link`, `motion.div`, another `createStyle` component).
   */
  as?: ReactElementType
  // `AllHTMLAttributes` declares its own `as?: string` (for `<link rel="preload">`),
  // which would otherwise intersect ours down to `ReactElementType & string`.
} & Omit<AllHTMLAttributes<T>, "as">

/**
 * The component type returned by `createStyle`.
 * A `forwardRef` React component with static properties for introspecting
 * the class string and default props set at creation time.
 *
 * @template T - The underlying HTML element type (e.g. `HTMLButtonElement`).
 *
 * @property classNames - The CSS class string provided at creation time.
 * @property props - The default props provided at creation time.
 * @property toString - Returns `classNames`, enabling `className={MyTag}` usage.
 */
export type CustomTag<T = ElementType> = {
  classNames?: string
  props?: { displayName?: string } & AllHTMLAttributes<T>
} & ForwardRefExoticComponent<CustomTagArgs<T> & RefAttributes<T>>

/**
 * Creates a reusable React component with pre-set CSS class names.
 * Ideal for Tailwind-based design systems. Think `styled-components` but class-based.
 *
 * Classes passed via `className` at render time are **appended** to the pre-set classes.
 * The returned component also supports an `as` prop to swap the rendered tag or
 * component at runtime, and forwards refs to the underlying DOM element.
 *
 * The returned `CustomTag` exposes:
 * - `.classNames` — the class string set at creation time
 * - `.props` — the default props set at creation time
 * - `.toString()` — returns `.classNames`, so `className={MyTag}` works directly
 *
 * @template T - The underlying HTML element type for prop/ref inference (e.g. `HTMLButtonElement`).
 * @param defaultTag - The HTML tag or React component to render by default.
 * @param classes - CSS class string applied to every instance.
 * @param defaultProps - Default HTML attributes merged with per-render props.
 *   `displayName` is consumed for React devtools and not forwarded to the DOM.
 * @returns A `forwardRef` React component (`CustomTag<T>`) with static `.classNames` and `.props`.
 *
 * @example Basic usage
 * ```tsx
 * const H1 = createStyle("h1", "text-lg font-serif leading-[1.5]")
 * const P  = createStyle("p",  "tracking-wide")
 *
 * <H1 className="mb-5">Hello</H1>  // renders: class="text-lg font-serif leading-[1.5] mb-5"
 * ```
 *
 * @example Override tag at render time with `as`
 * ```tsx
 * const H3 = createStyle("h3", "text-lg tracking-wide")
 * <H3 as="h1">Semantically h1, styled as h3</H3>
 * ```
 *
 * @example Render as a React component
 * `as` accepts any component, not just intrinsic tags. The merged class string is
 * passed along as `className`, so the component must accept and apply it. Props that
 * aren't standard HTML attributes are still rejected by the type.
 * ```tsx
 * const Button = createStyle("button", "rounded-full bg-red-500 px-4 py-2")
 * <Button as={Link} href="/signup">Sign up</Button>
 * ```
 *
 * @example Use a component as the default tag
 * ```tsx
 * const StyledLink = createStyle(Link, "underline underline-offset-2")
 * <StyledLink href="/about">About</StyledLink>
 * ```
 *
 * @example Typed generic for correct ref and prop types
 * ```ts
 * const Button = createStyle<HTMLButtonElement>("button", "rounded bg-red-500 text-white")
 * ```
 *
 * @example Default props (e.g. input type)
 * ```ts
 * const Checkbox = createStyle("input", "rounded border", { type: "checkbox" })
 * ```
 *
 * @example Display name for React devtools
 * ```ts
 * const Card = createStyle("article", "rounded p-2 bg-white", { displayName: "Card" })
 * ```
 *
 * @example Extract class string for use on other elements
 * ```tsx
 * const P = createStyle("p", "leading-[1.2] text-[1rem]")
 * <div className={P.classNames}>same classes, different element</div>
 * ```
 *
 * @example Dynamic classes with clsx
 * ```tsx
 * const Btn = createStyle("button", "rounded py-2 px-4", { type: "button" })
 * <Btn className={clsx(active ? "bg-red-500" : "bg-blue-500")}>Click</Btn>
 * ```
 *
 * @example Forwarded ref
 * ```tsx
 * const Container = createStyle<HTMLDivElement>("div", "max-w-screen-xl mx-auto")
 * const ref = useRef<HTMLDivElement>(null)
 * <Container ref={ref} />
 * ```
 */
export default function createStyle<T = ElementType>(
  defaultTag: ReactElementType,
  classes = "",
  defaultProps: { displayName?: string } & AllHTMLAttributes<T> = {}
): CustomTag<T> {
  const {
    displayName = null,
    className: propClassName,
    ...tagProps
  } = defaultProps
  /**
   * @param {AllHTMLAttributes<T>} props - The props to be passed to the created element.
   * @param {ReactElementType} [props.as] - Overwrite the rendered tag or component at render time.
   * @returns {React.ForwardRefExoticComponent<AllHTMLAttributes<T>>} customTag - The created element.
   */
  const customTag: CustomTag<T> = forwardRef<T, CustomTagArgs<T>>(
    ({ as, className = "", children, ...props }, ref) =>
      createElement(
        as || defaultTag,
        {
          className: [classes, propClassName, className]
            .filter(Boolean)
            .join(" "),
          ref,
          ...tagProps,
          ...props,
        },
        children
      )
  )

  customTag.displayName = displayName || `*${tagName(defaultTag)}`
  customTag.classNames = classes
  customTag.props = defaultProps
  customTag.toString = function toString() {
    return this.classNames || ""
  }

  return customTag
}
