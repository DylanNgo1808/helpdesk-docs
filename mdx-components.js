import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { Feedback } from './src/components/Feedback'
import { CopyButton } from './src/components/CopyButton'

const docsComponents = getDocsMDXComponents()

export const useMDXComponents = components => ({
  ...docsComponents,
  ...components,
  wrapper({ children, ...props }) {
    return docsComponents.wrapper({
      ...props,
      children: (
        <>
          <CopyButton />
          {children}
          <Feedback />
        </>
      )
    })
  }
})
