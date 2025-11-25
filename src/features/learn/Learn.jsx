// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

export default function Learn() {
  return (
    <div className="min-h-screen px-6 py-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Learn
          </h1>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            Interactive learning modules coming soon!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder cards */}
          {[
            { title: 'Programming Basics', icon: '💻', description: 'Learn fundamental programming concepts' },
            { title: 'Web Development', icon: '🌐', description: 'Build modern web applications' },
            { title: 'Data Structures', icon: '📊', description: 'Master essential data structures' },
            { title: 'Algorithms', icon: '🔍', description: 'Understand algorithmic thinking' },
            { title: 'Database Design', icon: '🗄️', description: 'Design efficient databases' },
            { title: 'System Design', icon: '🏗️', description: 'Learn scalable system architecture' },
          ].map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl backdrop-blur-xl border cursor-pointer hover:scale-105 transition-transform"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="text-4xl mb-4">{course.icon}</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                {course.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>{course.description}</p>
              <div className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                Coming Soon
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
