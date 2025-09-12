import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import BasicDataModule from './components/BasicDataModule'
import SmartReportsModule from './components/SmartReportsModule'
import ProjectInfoTable from './components/ProjectInfoTable'
import FundingTable from './components/FundingTable'
import KeyProjectsTable from './components/KeyProjectsTable'

function App() {
  return (
    <Router>
      <div className="main-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/basic-data" element={<BasicDataModule />} />
          <Route path="/basic-data/project-info" element={<ProjectInfoTable />} />
          <Route path="/basic-data/funding" element={<FundingTable />} />
          <Route path="/basic-data/key-projects" element={<KeyProjectsTable />} />
          <Route path="/smart-reports" element={<SmartReportsModule />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App