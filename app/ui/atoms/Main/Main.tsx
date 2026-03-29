import type { ComponentPropsWithoutRef } from 'react'

export type MainProps = ComponentPropsWithoutRef<'main'>

export const Main = ({ className, ...rest }: MainProps) => (
  <main className={className} {...rest} />
)
