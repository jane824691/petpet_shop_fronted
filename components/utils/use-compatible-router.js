let routerHook

try {
  // Pages Router
  routerHook = require('next/router').useRouter
} catch (e) {
  try {
    // App Router
    routerHook = require('next/navigation').useRouter
  } catch (e2) {
    routerHook = null
  }
}

export function useCompatibleRouter() {
  if (!routerHook) {
    return {
      push: (path) => {
        if (typeof window !== 'undefined') {
          window.location.href = path
        }
      },
    }
  }
  return routerHook() || { push: () => {} }
}
