import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components?: MDXComponents) {
  return getDocsMDXComponents(components)
}
