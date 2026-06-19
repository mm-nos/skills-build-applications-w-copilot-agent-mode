import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities'
import Leaderboard from './components/Leaderboard'
import Teams from './components/Teams'
import Users from './components/Users'
import Workouts from './components/Workouts'
import octofitLogo from '../../../docs/octofitapp-small.png'
import { apiBaseUrl, hasCodespaceApi } from './api'
import './App.css'

const routes = [
  { path: '/users', label: 'Users', title: 'Athlete Profiles', element: <Users /> },
  { path: '/teams', label: 'Teams', title: 'Teams', element: <Teams /> },
  { path: '/activities', label: 'Activities', title: 'Activity Log', element: <Activities /> },
  { path: '/leaderboard', label: 'Leaderboard', title: 'Leaderboard', element: <Leaderboard /> },
  { path: '/workouts', label: 'Workouts', title: 'Workout Suggestions', element: <Workouts /> },
]

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-lockup">
          <img src={octofitLogo} width="56" height="56" alt="Octofit Tracker" />
          <div>
            <p className="eyebrow">Octofit Tracker</p>
            <h1>Training Command Center</h1>
          </div>
        </div>
        <nav className="nav nav-pills app-nav" aria-label="Primary navigation">
          {routes.map((route) => (
            <NavLink className="nav-link" key={route.path} to={route.path}>
              {route.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="app-main">
        <div className="api-status">
          <span className={`status-dot ${hasCodespaceApi ? 'is-live' : 'is-local'}`}></span>
          <span>API: {apiBaseUrl}</span>
        </div>
        {!hasCodespaceApi && (
          <div className="alert alert-info mb-4" role="status">
            Set VITE_CODESPACE_NAME to use the forwarded Codespaces API URL. Falling back to localhost.
          </div>
        )}

        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <section className="resource-section">
                  <h2 className="section-title">{route.title}</h2>
                  {route.element}
                </section>
              }
            />
          ))}
        </Routes>
      </main>
    </div>
  )
}

export default App
