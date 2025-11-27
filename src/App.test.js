import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from './App';

// Mock axios to prevent actual API calls
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.reject(new Error('Network Error')))
}));

// Mock geolocation
const PERMISSION_DENIED = 1;
const mockGeolocation = {
  getCurrentPosition: jest.fn((success, error) => {
    // Simulate geolocation error to fallback to Riyadh
    error({ code: PERMISSION_DENIED, message: 'Permission denied' });
  }),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
};

beforeAll(() => {
  Object.defineProperty(global.navigator, 'geolocation', {
    value: mockGeolocation,
    writable: true,
  });
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

test('renders Weather App title', async () => {
  await act(async () => {
    render(<App />);
  });
  const titleElement = screen.getByText(/Weather App|تطبيق الطقس/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders search input', async () => {
  await act(async () => {
    render(<App />);
  });
  const inputElement = screen.getByPlaceholderText(/Enter city name|أدخل اسم المدينة/i);
  expect(inputElement).toBeInTheDocument();
});

test('renders search button', async () => {
  await act(async () => {
    render(<App />);
  });
  const buttonElement = screen.getByRole('button', { name: /Search|بحث/i });
  expect(buttonElement).toBeInTheDocument();
});

test('renders theme toggle button', async () => {
  await act(async () => {
    render(<App />);
  });
  const themeButton = screen.getByRole('button', { name: /Switch to dark mode|التبديل إلى الوضع الداكن/i });
  expect(themeButton).toBeInTheDocument();
});

test('renders location button', async () => {
  await act(async () => {
    render(<App />);
  });
  const locationButton = screen.getByRole('button', { name: /Get current location|الحصول على الموقع الحالي/i });
  expect(locationButton).toBeInTheDocument();
});

test('renders language toggle button', async () => {
  await act(async () => {
    render(<App />);
  });
  const languageButton = screen.getByRole('button', { name: /Switch to Arabic|التبديل إلى العربية/i });
  expect(languageButton).toBeInTheDocument();
});

test('shows error when submitting empty city', async () => {
  await act(async () => {
    render(<App />);
  });
  
  // Wait for initial load attempt to complete
  await waitFor(() => {
    expect(screen.getByRole('button', { name: /Search|بحث/i })).not.toBeDisabled();
  }, { timeout: 3000 });
  
  const inputElement = screen.getByPlaceholderText(/Enter city name|أدخل اسم المدينة/i);
  fireEvent.change(inputElement, { target: { value: '' } });
  const buttonElement = screen.getByRole('button', { name: /Search|بحث/i });
  fireEvent.click(buttonElement);
  
  await waitFor(() => {
    const errorElement = screen.getByText(/Please enter a city name|يرجى إدخال اسم المدينة/i);
    expect(errorElement).toBeInTheDocument();
  });
});
