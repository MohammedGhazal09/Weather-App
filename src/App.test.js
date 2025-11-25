import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock axios to prevent actual API calls
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.reject(new Error('Network Error')))
}));

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

test('shows error when submitting empty city', async () => {
  render(<App />);
  
  // Wait for initial load attempt to complete
  await waitFor(() => {
    expect(screen.getByRole('button', { name: /Search/i })).not.toBeDisabled();
  }, { timeout: 3000 });
  
  const inputElement = screen.getByPlaceholderText(/Enter city name/i);
  fireEvent.change(inputElement, { target: { value: '' } });
  const buttonElement = screen.getByRole('button', { name: /Search/i });
  fireEvent.click(buttonElement);
  
  await waitFor(() => {
    const errorElement = screen.getByText(/Please enter a city name/i);
    expect(errorElement).toBeInTheDocument();
  });
});
