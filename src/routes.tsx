import { createBrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import App from './App'
import Dashboard from './pages/Dashboard'
import Agenda from './pages/Agenda'
import NovoAgendamento from './pages/NovoAgendamento'
import Profissionais from './pages/Profissionais'
import Clientes from './pages/Clientes'
import Notificacoes from './pages/Notificacoes'
import Relatorios from './pages/Relatorios'
import Configuracoes from './pages/Configuracoes'
import Login from './pages/Login'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/',
        element: <App />,
        children: [
          {
            path: '/',
            element: <Dashboard />
          },
          {
            path: '/dashboard',
            element: <Dashboard />
          },
          {
            path: '/agenda',
            element: <Agenda />
          },
          {
            path: '/novo-agendamento',
            element: <NovoAgendamento />
          },
          {
            path: '/profissionais',
            element: <Profissionais />
          },
          {
            path: '/clientes',
            element: <Clientes />
          },
          {
            path: '/notificacoes',
            element: <Notificacoes />
          },
          {
            path: '/relatorios',
            element: <Relatorios />
          },
          {
            path: '/configuracoes',
            element: <Configuracoes />
          }
        ]
      }
    ]
  }
])

export function AppRouter() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  )
}
