import type { ReactNode } from 'react'

export type RenderOrNullProps = {
  readonly shouldRender: boolean
  readonly children: ReactNode
}

export const RenderOrNull = ({ shouldRender, children }: RenderOrNullProps) =>
  shouldRender ? children : null
