export default function About() {
  return (
    <main className="ml-64 min-h-screen" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
          About Learn Sphere ℹ️
        </h1>
        <p className="text-lg mb-8" style={{ color: '#8B949E' }}>
          Learn Sphere is your AI-powered education platform designed to help you learn smarter, not harder.
        </p>
        <div className="backdrop-blur-md border rounded-2xl p-8 max-w-2xl" style={{ 
          backgroundColor: 'rgba(13, 17, 23, 0.5)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: '#22D3EE' }}>Our Mission</h2>
          <p style={{ color: '#E5E7EB' }}>
            To provide personalized learning experiences powered by AI, helping students achieve their educational goals efficiently.
          </p>
        </div>
      </div>
    </main>
  )
}
