/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-named-as-default-member
import jmReact from "@josephmark/eslint-config-react"

export default [
  ...jmReact,
  {
    name: "@josephmark/createstyle:rules",
    rules: {
      "react/require-default-props": "off",
    },
  },
]
