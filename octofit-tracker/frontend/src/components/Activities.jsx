import { useEffect, useState } from 'react'
import { fetchCollection } from '../api'

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : 'Not logged'
}

function userLabel(user) {
  if (!user || typeof user !== 'object') {
    return 'Unknown athlete'
  }

  return user.displayName || user.username || 'Unknown athlete'
}

function Activities() {
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    fetchCollection('activities')
      .then((items) => {
        if (isCurrent) {
          setActivities(items)
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
    return <p className="text-secondary">Loading activities...</p>
  }

  if (error) {
    return <p className="alert alert-warning">Unable to load activities: {error}</p>
  }

  if (activities.length === 0) {
    return <p className="text-secondary">No activities have been logged yet.</p>
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">Athlete</th>
            <th scope="col">Activity</th>
            <th scope="col">Duration</th>
            <th scope="col">Calories</th>
            <th scope="col">Points</th>
            <th scope="col">Logged</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity._id || `${activity.userId}-${activity.loggedAt}`}>
              <td>{userLabel(activity.userId)}</td>
              <td>{activity.type}</td>
              <td>{activity.durationMinutes} min</td>
              <td>{activity.caloriesBurned}</td>
              <td>{activity.points}</td>
              <td>{formatDate(activity.loggedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Activities
