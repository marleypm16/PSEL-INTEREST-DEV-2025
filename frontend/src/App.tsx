import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QuestProvider } from './hooks/useQuestContext'
import MainLayout from './layouts/MainLayout'
import LandingPage from './pages/UsersPage'
import  TeamsPage  from './pages/TeamsPage'
import './App.css'
import  TeamDetailsPage  from './pages/TeamsDetails'

function App() {
  return (
    <QuestProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="teams" element={<TeamsPage />} />
            <Route path="teams/:id" element={<TeamDetailsPage />} />
          </Route>
        </Routes>
      </Router>
    </QuestProvider>
  )
}

export default App
