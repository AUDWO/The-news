let state = null;

let listeners = [];

const createState = (initialState) => {
  state = new Proxy(initialState, {
    set(target, key, value) {
      if (target[key] === value) return false;

      target[key] === value;

      listeners.forEach((component) => component.render());
      return true;
    },
  });

  return state;
};

const subscribe = (newListner) => {
  if (!listeners.includes(newListner)) listeners = [...listeners, newListner];

  return () => {
    listeners = listeners.filter((listener) => listener !== newListner);
  };
};

export { state, subscribe, createState };
