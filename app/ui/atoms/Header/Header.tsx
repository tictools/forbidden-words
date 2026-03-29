import type { ComponentPropsWithoutRef } from 'react'

export type HeaderProps = ComponentPropsWithoutRef<'header'>

export const Header = ({ className, ...rest }: HeaderProps) => (
  <header className={className} {...rest} />
)
