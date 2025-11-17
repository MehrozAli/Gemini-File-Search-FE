import { describe, expect, it } from 'vitest';
import { getErrorMessage } from './errorHandler';

const axiosError = (data) => ({ message: 'Request failed', response: { data } });

describe('getErrorMessage', () => {
  it('falls back to the default for empty errors', () => {
    expect(getErrorMessage(null, 'fallback')).toBe('fallback');
  });

  it('uses the network error message when there is no response body', () => {
    expect(getErrorMessage(new Error('Network Error'))).toBe('Network Error');
  });

  it('reads a FastAPI string detail', () => {
    expect(getErrorMessage(axiosError({ detail: 'Store not found' }))).toBe('Store not found');
  });

  it('reads the first FastAPI validation error', () => {
    const error = axiosError({ detail: [{ loc: ['body', 'prompt'], msg: 'Field required' }] });
    expect(getErrorMessage(error)).toBe('Field required');
  });

  it('never returns an object', () => {
    expect(getErrorMessage(axiosError({ detail: { code: 42 } }), 'fallback')).toBe('fallback');
  });

  it('reads a top-level message', () => {
    expect(getErrorMessage(axiosError({ message: 'Quota exceeded' }))).toBe('Quota exceeded');
  });
});
