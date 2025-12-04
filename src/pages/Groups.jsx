import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { localGroupService } from '../services/localGroupService'
import { Users, Plus, ChevronRight } from 'lucide-react'

export default function Groups() {
  const [groups, setGroups] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [groupType, setGroupType] = useState('study')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchGroups()
  }, [])

  async function fetchGroups() {
    setLoading(true)
    const { data, error } = await localGroupService.listMyGroups()
    if (error) setError(error.message || error)
    else setGroups(data || [])
    setLoading(false)
  }

  async function handleCreate(e) {
    e.preventDefault()
    setError(null)
    const { data, error } = await localGroupService.createGroup({ name, description, groupType })
    if (error) return setError(error.message || error)
    setName('')
    setDescription('')
    setGroupType('study')
    fetchGroups()
    navigate(`/groups/${data.id}`)
  }

  return (
    <main 
      className="min-h-screen ml-64 p-8"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users size={32} style={{ color: 'var(--accent-primary)' }} />
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              My Study Groups
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Create study groups, track attendance, and collaborate with peers
          </p>
        </div>

        {error && (
          <div 
            className="mb-6 p-4 rounded-lg border"
            style={{ 
              backgroundColor: 'hsla(0, 70%, 50%, 0.1)',
              borderColor: 'var(--feedback-error)',
              color: 'var(--feedback-error)'
            }}
          >
            {String(error)}
          </div>
        )}

        {/* Create Group Form */}
        <section 
          className="mb-8 p-6 rounded-xl border"
          style={{
            backgroundColor: 'var(--ui-white)',
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Plus size={20} />
            Create New Group
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                required
                placeholder="Group name (e.g., CS101 Study Group)"
                value={name}
                onChange={e => setName(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent-primary)'
                }}
              />
              <input
                placeholder="Description (optional)"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent-primary)'
                }}
              />
            </div>
            <div className="flex gap-3 items-center">
              <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Group Type:
              </label>
              <select
                value={groupType}
                onChange={e => setGroupType(e.target.value)}
                className="px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent-primary)'
                }}
              >
                <option value="study">Study Group</option>
                <option value="project">Project Team</option>
                <option value="exam">Exam Prep</option>
                <option value="homework">Homework Help</option>
                <option value="other">Other</option>
              </select>
              <button
                type="submit"
                className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap ml-auto"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--ui-white)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Plus size={18} />
                Create
              </button>
            </div>
          </form>
        </section>

        {/* Groups List */}
        <section>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Your Groups ({groups.length})
          </h2>
          
          {loading ? (
            <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--accent-primary)' }}></div>
              Loading groups...
            </div>
          ) : groups.length === 0 ? (
            <div 
              className="text-center py-16 rounded-xl border"
              style={{
                backgroundColor: 'var(--ui-white)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)'
              }}
            >
              <Users size={48} className="mx-auto mb-4 opacity-40" />
              <p className="text-lg mb-2">No groups yet</p>
              <p className="text-sm">Create your first study group above to get started!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {groups.map(g => (
                <div
                  key={g.id}
                  className="p-5 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer"
                  style={{
                    backgroundColor: 'var(--ui-white)',
                    borderColor: 'var(--border-color)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  onClick={() => navigate(`/groups/${g.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                        {g.name}
                      </h3>
                      {g.description && (
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {g.description}
                        </p>
                      )}
                      <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                        Created {new Date(g.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <ChevronRight size={24} style={{ color: 'var(--accent-primary)' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
