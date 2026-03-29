import type { ComponentPropsWithoutRef } from 'react'

export type BoxProps = ComponentPropsWithoutRef<'div'>

export const Box = ({ className, ...rest }: BoxProps) => (
  <div className={className} {...rest} />
)
