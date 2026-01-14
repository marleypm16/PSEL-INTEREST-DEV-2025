import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import UsersPage from './pages/UsersPage' 
import  TeamsPage  from './pages/TeamsPage'
import  TeamDetailsPage  from './pages/TeamsDetails'

function App() {
  return (
      <Router>
        <Routes>
            <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/teams" replace />} />            
            <Route path='users' element={<UsersPage />} />
            <Route path="teams" element={<TeamsPage />} />
            <Route path="teams/:id" element={<TeamDetailsPage />} />
          </Route>
        </Routes>
      </Router>
  )
}

export default App
