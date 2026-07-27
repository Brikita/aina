import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function MainLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 text-slate-900">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="min-h-0 flex-1 overflow-hidden p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}