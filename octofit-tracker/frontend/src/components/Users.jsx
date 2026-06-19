import { useEffect, useState } from 'react'
import { fetchCollection } from '../api'

const usersResource = '-8000.app.github.dev/api/users'.split('/').pop()

function teamName(team) {
  if (!team || typeof team !== 'object') {
    return 'Unassigned'
  }

  return team.name || 'Unassigned'
}

function Users() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    fetchCollection(usersResource)
      .then((items) => {
        if (isCurrent) {
          setUsers(items)
          setError('')
        }
      })
      .catch((fetchError) => {
        if (isCurrent) {
          setError(fetchError.message)
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [])

  if (isLoading) {
    return <p className="text-secondary">Loading users...</p>
  }

  if (error) {
    return <p className="alert alert-warning">Unable to load users: {error}</p>
  }

  if (users.length === 0) {
    return <p className="text-secondary">No users have joined Octofit yet.</p>
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Username</th>
            <th scope="col">Email</th>
            <th scope="col">Team</th>
            <th scope="col">Level</th>
            <th scope="col">Goal</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id || user.email}>
              <td>{user.displayName}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{teamName(user.teamId)}</td>
              <td className="text-capitalize">{user.profile?.level || 'beginner'}</td>
              <td>{user.profile?.fitnessGoal || 'Build a consistent training habit'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
