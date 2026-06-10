import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom'
import { Layout } from './Layout'
import { OrchestrationContainer } from '@/containers/OrchestrationContainer'
import { AgentDetailContainer } from '@/containers/AgentDetailContainer'
import { JudgmentDayContainer } from '@/containers/JudgmentDayContainer'
import { AgentsList } from '@/views/AgentsList'

export const routeObjects: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/orchestration" replace /> },
      { path: 'orchestration', element: <OrchestrationContainer /> },
      { path: 'agents', element: <AgentsList /> },
      { path: 'agents/:figura', element: <AgentDetailContainer /> },
      { path: 'judgment/:jiraKey', element: <JudgmentDayContainer /> },
    ],
  },
]

export const router = createBrowserRouter(routeObjects)
