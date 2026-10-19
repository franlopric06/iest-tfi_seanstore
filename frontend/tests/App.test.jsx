import { render, screen } from '@testing-library/react'
import App from '../src/App.jsx'

describe('App', () => {
  it("muestra el título Sean's Store", () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Sean's Store")
  })
})
