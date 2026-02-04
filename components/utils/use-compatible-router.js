let useRouterImpl

try {
  // Pages Router
  useRouterImpl = require('next/router').useRouter
} catch (e) {
  try {
    // App Router
    useRouterImpl = require('next/navigation').useRouter
  } catch (e2) {
    useRouterImpl = null
  }
}

export function useCompatibleRouter() {
  if (!useRouterImpl) {
    return {
      push: (path) => {
        if (typeof window !== 'undefined') {
          window.location.href = path
        }
      },
    }
  }
  return useRouterImpl || { push: () => {} }
}
