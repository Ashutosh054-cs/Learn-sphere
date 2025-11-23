import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { supabase } from '../lib/supabase'
import { Camera, Save, LogOut } from 'lucide-react'

export default function Profile() {
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)
  const signOut = useAuthStore(state => state.signOut)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    avatar_url: ''
  })

  useEffect(() => {
    if (user) {
      // Load user profile data
      setProfile({
        name: user.user_metadata?.name || '',
        bio: user.user_metadata?.bio || '',
        avatar_url: user.user_metadata?.avatar_url || ''
      })
    }
  }, [user])

  const handleImageUpload = async (e) => {
    try {
      setUploading(true)
      setMessage({ type: '', text: '' })

      const file = e.target.files?.[0]
      if (!file) return

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image must be less than 2MB' })
        setUploading(false)
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'File must be an image' })
        setUploading(false)
        return
      }

      // Create unique filename with user ID prefix
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      // Delete old avatar if exists
      if (profile.avatar_url) {
        const oldPath = profile.avatar_url.split('/user-uploads/')[1]
        if (oldPath) {
          await supabase.storage.from('user-uploads').remove([oldPath])
        }
      }

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(fileName, file, { 
          cacheControl: '3600',
          upsert: true 
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw new Error(uploadError.message)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(fileName)

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }))
      setMessage({ type: 'success', text: 'Image uploaded successfully!' })
    } catch (error) {
      console.error('Profile image error:', error)
      setMessage({ type: 'error', text: `Upload failed: ${error.message}. Please check Supabase storage setup.` })
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setMessage({ type: '', text: '' })

      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          name: profile.name,
          bio: profile.bio,
          avatar_url: profile.avatar_url
        }
      })

      if (error) throw error

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <main className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Profile Settings
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage your account information and preferences
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div 
            className="mb-6 p-4 rounded-lg border-2"
            style={{
              backgroundColor: message.type === 'success' 
                ? 'rgba(34, 197, 94, 0.1)' 
                : 'rgba(215, 60, 75, 0.1)',
              borderColor: message.type === 'success' 
                ? 'rgba(34, 197, 94, 0.3)' 
                : 'rgba(215, 60, 75, 0.3)'
            }}
          >
            <p style={{ color: message.type === 'success' ? '#22C55E' : '#D73C4B' }}>
              {message.text}
            </p>
          </div>
        )}

        {/* Profile Card */}
        <div 
          className="rounded-2xl p-8 border-2"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)'
          }}
        >
          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div 
                className="w-32 h-32 rounded-full overflow-hidden border-4 flex items-center justify-center"
                style={{ borderColor: 'var(--accent-primary)' }}
              >
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <span className="text-4xl font-bold" style={{ color: 'var(--text-secondary)' }}>
                      {user?.user_metadata?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
              
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-2 transition-transform hover:scale-110"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  borderColor: 'var(--bg-primary)'
                }}
              >
                <Camera size={20} color="white" />
              </label>
              
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </div>
            
            {uploading && (
              <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Uploading...
              </p>
            )}
          </div>

          {/* Email (Read-only) */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 rounded-lg border-2 opacity-60 cursor-not-allowed"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {/* Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {/* Bio */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              About Me
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-all resize-none"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
            <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {profile.bio.length}/500 characters
            </p>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            style={{
              background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
              color: 'white'
            }}
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.02] border-2"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)'
            }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </main>
  )
}
