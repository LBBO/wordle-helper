export const wait = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
