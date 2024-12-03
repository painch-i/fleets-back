import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const navigateOptions = { replace: true };

/**
 * Custom hook to manage a single query parameter in the URL.
 * @param {string} key - The name of the query parameter to manage.
 */
export function useQueryParam(key: string) {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);

  /**
   * Current value of the query parameter.
   * Returns `null` if the parameter is not present.
   */
  const value = query.get(key)?.toString();

  /**
   * Boolean indicating whether the query parameter exists in the URL.
   */
  const exist = !!value;

  /**
   * Adds or updates the query parameter with a specified value.
   * @param {string} value - The value to set for the query parameter.
   */
  const addQueryParam = useCallback(
    (value: string = 'true'): void => {
      query.set(key, value);
      navigate({ search: query.toString() }, navigateOptions);
    },
    [key, query],
  );

  /**
   * Removes the query parameter from the URL.
   */
  const removeQueryParam = useCallback((): void => {
    query.delete(key);
    navigate({ search: query.toString() }, navigateOptions);
  }, [key, query]);

  /**
   * Toggles the existence of the query parameter in the URL.
   * Adds the query parameter with a default value of `true` if it doesn't exist.
   * Removes the query parameter if it exists.
   */
  const toggleQueryParam = useCallback(
    (value: string = 'true'): void => {
      if (exist) {
        removeQueryParam();
        return;
      }

      addQueryParam(value);
    },
    [exist],
  );

  return { toggleQueryParam, addQueryParam, removeQueryParam, value, exist };
}
