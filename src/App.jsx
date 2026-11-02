import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import NewTicket from './pages/NewTicket'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/tickets/new" element={<NewTicket />} />
      </Route>
      <Route path="*" element={<Navigate to="/tickets/new" replace />} />
    </Routes>
  )
}
