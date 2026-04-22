import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Heading } from '@app/ui/atoms/Heading/Heading'

describe('Heading', () => {
  it('renders h1 when level is 1', () => {
    render(<Heading level={1}>Title</Heading>)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Title' }),
    ).toBeInTheDocument()
  })

  it('renders h2 when level is 2', () => {
    render(<Heading level={2}>Subtitle</Heading>)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Subtitle' }),
    ).toBeInTheDocument()
  })

  it('renders h3 when level is 3', () => {
    render(<Heading level={3}>Section</Heading>)

    expect(
      screen.getByRole('heading', { level: 3, name: 'Section' }),
    ).toBeInTheDocument()
  })
})
