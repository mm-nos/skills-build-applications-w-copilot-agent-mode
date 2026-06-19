import { useEffect, useState } from 'react'
import { fetchCollection } from '../api'

function athleteName(entry) {
  if (entry.displayName || entry.username) {
    return entry.displayName || entry.username
  }

  if (entry.userId && typeof entry.userId === 'object') {
    return entry.userId.displayName || entry.userId.username || 'Unknown athlete'
  }

  return 'Unknown athlete'
}

function Leaderboard() {
  const [leaders, setLeaders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    fetchCollection('leaderboard')
      .then((items) => {
        if (isCurrent) {
          setLeaders(items)
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
    return <p className="text-secondary">Loading leaderboard...</p>
  }

  if (error) {
    return <p className="alert alert-warning">Unable to load leaderboard: {error}</p>
  }

  if (leaders.length === 0) {
    return <p className="text-secondary">No leaderboard entries are available yet.</p>
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Athlete</th>
            <th scope="col">Points</th>
            <th scope="col">Activities</th>
            <th scope="col">Calories</th>
            <th scope="col">Minutes</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((entry, index) => (
            <tr key={entry._id || entry.userId?._id || entry.userId || index}>
              <td>#{entry.rank || index + 1}</td>
              <td>{athleteName(entry)}</td>
              <td>{entry.totalPoints}</td>
              <td>{entry.activityCount}</td>
              <td>{entry.totalCaloriesBurned}</td>
              <td>{entry.totalDurationMinutes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Leaderboard
