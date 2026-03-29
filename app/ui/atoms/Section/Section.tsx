import type { ComponentPropsWithoutRef } from 'react'

export type SectionProps = ComponentPropsWithoutRef<'section'>

export const Section = ({ className, ...rest }: SectionProps) => (
  <section className={className} {...rest} />
)
