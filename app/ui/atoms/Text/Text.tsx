import type { ComponentPropsWithoutRef } from 'react'

export type TextProps = ComponentPropsWithoutRef<'p'>

export const Text = ({ className, ...rest }: TextProps) => (
  <p className={className} {...rest} />
)
