import { forwardRef, type ComponentPropsWithoutRef } from 'react'

export type ButtonProps = ComponentPropsWithoutRef<'button'>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = 'button', ...rest }, ref) => (
    <button ref={ref} className={className} type={type} {...rest} />
  ),
)

Button.displayName = 'Button'
