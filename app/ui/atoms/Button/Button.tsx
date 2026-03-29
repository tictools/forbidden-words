import type { ComponentPropsWithoutRef } from 'react'

export type ButtonProps = ComponentPropsWithoutRef<'button'>

export const Button = ({ className, type = 'button', ...rest }: ButtonProps) => (
  <button className={className} type={type} {...rest} />
)
