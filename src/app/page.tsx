export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Bienvenue sur My Invoicing App
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 mb-4">
            TailwindCSS v3 est maintenant configuré et fonctionne parfaitement !
          </p>
          <div className="flex gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
              Test Button 1
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors">
              Test Button 2
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}