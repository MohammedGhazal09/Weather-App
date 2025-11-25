import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders weather app title', () => {
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
  const buttonElement = screen.getByRole('button', { name: /search/i });
  expect(buttonElement).toBeInTheDocument();
});

test('renders welcome message when no weather data', () => {
  render(<App />);
  const welcomeText = screen.getByText(/Enter a city name to get the current weather/i);
  expect(welcomeText).toBeInTheDocument();
});

test('allows typing in search input', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/Enter city name/i);
  fireEvent.change(inputElement, { target: { value: 'London' } });
  expect(inputElement.value).toBe('London');
});
