import {
  AllHTMLAttributes,
  createElement,
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

export type CustomTagArgs<T = ElementType> = {
  as?: keyof JSX.IntrinsicElements
} & AllHTMLAttributes<T>

export type CustomTag<T = ElementType> = {
  classNames?: string
} & ForwardRefExoticComponent<CustomTagArgs<T> & RefAttributes<T>>

/**
 * Creates a re-usable element with pre-set classnames
 * Great for building generic, pure, Tailwind components
 *
 * @template T - The type of the HTML element to be created.
 * @param {keyof JSX.IntrinsicElements} defaultTag - The default tag name of the HTML element to be created.
 * @param {string} classes - The pre-set classnames to be applied to the created element.
 * @param {AllHTMLAttributes<T>} defaultProps - The default props for the created element.
 * @param {string} [defaultProps.displayName] - The display name of the created element (for devtools!).
 * @returns {React.ForwardRefExoticComponent<AllHTMLAttributes<T>>} - The created element.
 */
export default function createStyle<T = ElementType>(
  defaultTag: keyof JSX.IntrinsicElements,
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
   * @param {keyof JSX.IntrinsicElements} [props.as] - Overwrite the tag name of the HTML element at render time.
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

  customTag.displayName = displayName || `*${defaultTag}`
  customTag.classNames = classes
  customTag.toString = function toString() {
    return this.classNames
  }

  return customTag
}
