import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  it('should return the debounced value', () => {
    const value = 'test';
    const delay = 100;
    const { result } = renderHook(() => useDebounce(value, delay));
    expect(result.current).toBe(value);
  });

  it('should return the debounced value after the delay', async () => {
    const value = 'test';
    const delay = 100;
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: '', delay: 0 },
      }
    );

    rerender({ value, delay });

    expect(result.current).toBe('');

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, delay));
    });

    expect(result.current).toBe(value);
  });
});
