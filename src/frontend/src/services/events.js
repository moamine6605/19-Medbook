const listeners = new Map();

export function onEvent(eventName, handler) {
  if (!listeners.has(eventName)) listeners.set(eventName, new Set());
  const set = listeners.get(eventName);
  set.add(handler);
  return () => {
    set.delete(handler);
    if (set.size === 0) listeners.delete(eventName);
  };
}

export function emitEvent(eventName, payload) {
  const set = listeners.get(eventName);
  if (!set || set.size === 0) return;
  for (const fn of Array.from(set)) {
    try {
      fn(payload);
    } catch (e) {
      // Don’t break other listeners.
      console.error('emitEvent handler error', e);
    }
  }
}

