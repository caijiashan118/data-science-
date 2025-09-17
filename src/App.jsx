import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Spin } from 'antd'

// Lazy load components for better performance
const HomePage = lazy(() => import('@components/HomePage'))
const BasicDataModule = lazy(() => import('@components/BasicDataModule'))
const SmartReportsModule = lazy(() => import('@components/SmartReportsModule'))
const ProjectInfoTable = lazy(() => import('@components/ProjectInfoTable'))
const FundingTable = lazy(() => import('@components/FundingTable'))
const KeyProjectsTable = lazy(() => import('@components/KeyProjectsTable'))

// Loading component
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <Spin size="large" tip="加载中..." />
  </div>
)

function App() {
  return (
    <Router>
      <div className="main-container">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/basic-data" element={<BasicDataModule />} />
            <Route path="/basic-data/project-info" element={<ProjectInfoTable />} />
            <Route path="/basic-data/funding" element={<FundingTable />} />
            <Route path="/basic-data/key-projects" element={<KeyProjectsTable />} />
            <Route path="/smart-reports" element={<SmartReportsModule />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  )
}

export default App