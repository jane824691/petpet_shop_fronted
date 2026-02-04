'use client'

import { useEffect } from 'react'

export default function BootstrapInit() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap')
  }, [])
  return null
}
