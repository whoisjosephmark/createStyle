import { AllHTMLAttributes, createElement, forwardRef } from "react"

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
  inert?: string | null
} & AllHTMLAttributes<T>

/**
 * Creates a re-usable element with pre-set classnames
 * Great for building generic, pure, Tailwind components
 */
export default function createStyle<T = ElementType>(
  defaultTag: keyof JSX.IntrinsicElements,
  classes = "",
  defaultProps: { displayName?: string } & AllHTMLAttributes<T> = {}
) {
  const { displayName = null, ...tagProps } = defaultProps
  const customStyledTag = forwardRef<T, CustomTagArgs<T>>(
    ({ as, className = "", children, ...props }, ref) =>
      createElement(
        as || defaultTag,
        {
          className: [classes, className].filter(Boolean).join(" "),
          ref,
          ...tagProps,
          ...props,
        },
        children
      )
  )

  customStyledTag.displayName = displayName || `*${defaultTag}`

  return customStyledTag
}
