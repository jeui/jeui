export function findParentComponent(context, componentName) {
  let parent = context.$parent, name = parent.$options.name, component = {}

  while (parent && name) {
    if (componentName === name) {
      component = parent
    }

    parent = parent.$parent
    if (parent) {
      name = parent.$options.name
    }
  }
  return component
}

// Find components upward
export function findComponentUpward(context, componentName, componentNames) {
  let parent = context.$parent, name = parent.$options.name;
  if (typeof componentName === 'string') {
    componentNames = [componentName];
  } else {
    componentNames = componentName;
  }

  while (parent && (!name || componentNames.indexOf(name) < 0)) {
    parent = parent.$parent;
    if (parent) name = parent.$options.name;
  }
  return parent;
}


// Find component downward
export function findComponentDownward(context, componentName) {
  let childrens = context.$children, children = null;

  if (childrens.length) {
    for (const child of childrens) {
      const name = child.$options.name;
      if (name === componentName) {
        children = child;
        break;
      } else {
        children = findComponentDownward(child, componentName);
        if (children) break;
      }
    }
  }
  return children;
}

// Find components downward
export function findComponentsDownward(context, componentName) {
  return context.$children.reduce((components, child) => {
    if (child.$options.name === componentName) components.push(child);
    const foundChilds = findComponentsDownward(child, componentName);
    return components.concat(foundChilds);
  }, []);
}

// Find components upward
export function findComponentsUpward(context, componentName) {
  let parents = [], parent = context.$parent;
  if (parent) {
    if (parent.$options.name === componentName) parents.push(parent);
    return parents.concat(findComponentsUpward(parent, componentName));
  } else {
    return [];
  }
}
