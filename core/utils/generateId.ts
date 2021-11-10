export function generateId() {
    const rand = (Math.random() * 10000) >> 0;

    return (Date.now() + rand).toString(35);
}