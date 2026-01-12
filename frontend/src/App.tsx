import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QuestProvider } from './hooks/useQuestContext'
import MainLayout from './layouts/MainLayout'
import UsersPage from './pages/UsersPage' 
import  TeamsPage  from './pages/TeamsPage'
import './App.css'
import  TeamDetailsPage  from './pages/TeamsDetails'
import  NotFoundPage  from './pages/NotFound'

function App() {
  return (
    <QuestProvider>
      <Router>
        <Routes>
            <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/teams" replace />} />            
            <Route path='users' element={<UsersPage />} />
            <Route path="teams" element={<TeamsPage />} />
            <Route path="teams/:id" element={<TeamDetailsPage />} />
            <Route path="*" element={<NotFoundPage/>} />
          </Route>
        </Routes>
      </Router>
    </QuestProvider>
  )
}

export default App
