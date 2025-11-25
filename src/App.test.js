import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders Weather App title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Weather App/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders search input', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/Enter city name/i);
  expect(inputElement).toBeInTheDocument();
});

test('renders search button', () => {
  render(<App />);
  const buttonElement = screen.getByRole('button', { name: /Search/i });
  expect(buttonElement).toBeInTheDocument();
});

test('shows error when submitting empty city', () => {
  render(<App />);
  const buttonElement = screen.getByRole('button', { name: /Search/i });
  fireEvent.click(buttonElement);
  const errorElement = screen.getByText(/Please enter a city name/i);
  expect(errorElement).toBeInTheDocument();
});
