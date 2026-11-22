import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import OwnerTreePage from './pages/OwnerTreePage'
import PublicTreePage from './pages/PublicTreePage'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<Navigate to="/" replace />} />
          <Route path="/tree/:slug" element={<PublicTreePage />} />
          <Route path="/my-tree/:slug" element={<OwnerTreePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
