import { useEffect, useState } from 'react'
import { fetchCollection } from '../api'

const workoutsResource = '-8000.app.github.dev/api/workouts'.split('/').pop()

function exerciseList(exercises) {
  if (!Array.isArray(exercises) || exercises.length === 0) {
    return 'No exercises listed'
  }

  return exercises.join(', ')
}

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    fetchCollection(workoutsResource)
      .then((items) => {
        if (isCurrent) {
          setWorkouts(items)
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
    return <p className="text-secondary">Loading workouts...</p>
  }

  if (error) {
    return <p className="alert alert-warning">Unable to load workouts: {error}</p>
  }

  if (workouts.length === 0) {
    return <p className="text-secondary">No workout suggestions are available yet.</p>
  }

  return (
    <div className="row g-3">
      {workouts.map((workout) => (
        <div className="col-md-6 col-xl-4" key={workout._id || workout.title}>
          <article className="resource-card h-100">
            <div className="d-flex justify-content-between gap-3">
              <h2>{workout.title}</h2>
              <span className="badge text-bg-primary align-self-start text-capitalize">
                {workout.level}
              </span>
            </div>
            <p className="text-secondary">{workout.category}</p>
            <p className="my-3">{exerciseList(workout.exercises)}</p>
            <p className="fw-semibold">{workout.durationMinutes} minutes</p>
          </article>
        </div>
      ))}
    </div>
  )
}

export default Workouts
