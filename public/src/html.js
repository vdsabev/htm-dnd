import htm from 'htm';

function h(type, props, ...children) {
  if (typeof type === 'function') {
    return type(props || {}, children?.flat());
  }

  const element = document.createElement(type);

  Object.keys(props || {}).forEach((key) => {
    const prop = props[key];
    if (typeof prop === 'function') {
      element.addEventListener(key.replace(/^on/, ''), prop);
    } else {
      element.setAttribute(key, prop);
    }
  });

  // TODO: Figure out why I need `flat(2)`
  element.append(...children.flat(2));

  return element;
}

export default htm.bind(h);
