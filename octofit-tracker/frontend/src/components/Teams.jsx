import { useEffect, useState } from 'react'
import { fetchCollection } from '../api'

const teamsResource = '-8000.app.github.dev/api/teams'.split('/').pop()

function memberNames(members) {
  if (!Array.isArray(members) || members.length === 0) {
    return 'No members yet'
  }

  return members
    .map((member) => member.displayName || member.username || 'Unnamed member')
    .join(', ')
}

function Teams() {
  const [teams, setTeams] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    fetchCollection(teamsResource)
      .then((items) => {
        if (isCurrent) {
          setTeams(items)
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
    return <p className="text-secondary">Loading teams...</p>
  }

  if (error) {
    return <p className="alert alert-warning">Unable to load teams: {error}</p>
  }

  if (teams.length === 0) {
    return <p className="text-secondary">No teams have been created yet.</p>
  }

  return (
    <div className="row g-3">
      {teams.map((team) => (
        <div className="col-md-6" key={team._id || team.name}>
          <article className="resource-card h-100">
            <div className="d-flex justify-content-between gap-3">
              <div>
                <h2>{team.name}</h2>
                <p className="text-secondary">Mascot: {team.mascot}</p>
              </div>
              <span className="badge text-bg-success align-self-start">
                {team.memberIds?.length || 0} members
              </span>
            </div>
            <p className="mt-3">{memberNames(team.memberIds)}</p>
          </article>
        </div>
      ))}
    </div>
  )
}

export default Teams
