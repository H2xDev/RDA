const c = require.context('./', false, /\.vue$/);

const entries = c.keys().map((path) => {
    const fname = path.split('/').pop()!.split('.').shift();
    const component = c(path).default;
    const name = component.name || fname;

    return [name, component];
})

export const statesComponents = Object.fromEntries(entries);
