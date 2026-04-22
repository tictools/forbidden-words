import type { HTMLAttributes } from 'react'

export type HeadingLevel = 1 | 2 | 3

export type HeadingProps = {
  readonly level: HeadingLevel
} & HTMLAttributes<HTMLHeadingElement>

export const Heading = ({ level, ...rest }: HeadingProps) => {
  switch (level) {
    case 1:
      return <h1 {...rest} />
    case 2:
      return <h2 {...rest} />
    case 3:
      return <h3 {...rest} />
    default: {
      const _exhaustive: never = level
      return _exhaustive
    }
  }
}
