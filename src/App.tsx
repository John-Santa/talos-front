import { RouterProvider } from 'react-router-dom'
import { RepositoryProvider } from '@/data/RepositoryProvider'
import { ViewModeProvider } from '@/app/ViewMode'
import { router } from '@/app/routes'

/** Root: data provider + view-mode provider + the router. */
export default function App() {
  return (
    <RepositoryProvider>
      <ViewModeProvider>
        <RouterProvider router={router} />
      </ViewModeProvider>
    </RepositoryProvider>
  )
}
