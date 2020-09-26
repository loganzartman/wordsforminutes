import {useState} from './preact.js';

/**
 * Behaves like useState(), but persists the value to a Storage object.
 * The initial state will be read from storage, if it exists.
 *
 * The state type must be serializable to JSON.
 *
 * @param initialState the initial value for the state
 * @param key unique identifier for this value
 * @param storage a backing store object implementing the Storage interface
 */
export default function useStoredState(initialState, key, storage = window.localStorage) {
  const getInitial = () =>
    initialState instanceof Function ? initialState() : initialState;

  const getValue = () => {
    const v = storage.getItem(key);
    return v ? JSON.parse(v) : getInitial();
  };

  const [value, setValue] = useState(getValue());

  // state setter wrapper that stores new value to storage
  const setValueWrapper = (x) => {
    const newValue = x instanceof Function ? x(value) : x;
    storage.setItem(key, JSON.stringify(newValue));
    setValue(newValue);
  };

  return [value, setValueWrapper];
}
