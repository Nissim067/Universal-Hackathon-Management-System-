import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col">
      {/* Navbar will go here */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<div className="p-8 text-center"><h1 className="text-4xl font-display font-bold text-accent">Universal Hackathon Management System</h1><p className="mt-4 text-text-secondary">Frontend setup complete. Ready to build.</p></div>} />
          {/* Add more routes as we build */}
        </Routes>
      </main>
      {/* Footer will go here */}
    </div>
  )
}

export default App
