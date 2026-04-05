import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider, theme } from 'antd'
import frFR from 'antd/locale/fr_FR'
import { queryClient } from '../router'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={frFR}
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: '#6366f1',
            borderRadius: 12,
          },
        }}
      >
        <Outlet />
      </ConfigProvider>
    </QueryClientProvider>
  )
}
