'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { RecoilRoot } from 'recoil'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <CacheProvider>
        <ChakraProvider>{children}</ChakraProvider>
      </CacheProvider>
    </RecoilRoot>
  )
}
