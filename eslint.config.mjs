import jmReact from "@josephmark/eslint-config-react"

export default [
    ...jmReact,
    {
      name: "@josephmark/createstyle:rules",
      rules: {
        "react/require-default-props": "off"
      }
    }
]
