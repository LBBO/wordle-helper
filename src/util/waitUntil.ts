export const waitUntil = (predicate: () => boolean) =>
  new Promise<void>((resolve) => {
    const wait = () => {
      requestAnimationFrame(() => {
        if (predicate()) {
          resolve()
        } else {
          wait()
        }
      })
    }

    wait()
  })
