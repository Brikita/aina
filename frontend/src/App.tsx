import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext'
import { MainLayout } from './components/layout/MainLayout'
import { Dashboard } from './pages/Dashboard'

function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex h-full min-h-0 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/80 p-8 text-center shadow-sm">
      <div className="max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">AINA Module</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="map" element={<Dashboard />} />
            <Route
              path="playbooks"
              element={
                <PlaceholderPage
                  title="Playbooks"
                  description="Operational playbooks for flood and drought response will live here as the sprint expands."
                />
              }
            />
            <Route
              path="observatory"
              element={
                <PlaceholderPage
                  title="Observatory"
                  description="Streaming monitoring, indicators, and reporting views can be layered into this module next."
                />
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  )
}

export default App
