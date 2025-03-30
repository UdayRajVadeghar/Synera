import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]">
        <div className="absolute inset-0 bg-grid-pattern opacity-25"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/10 to-blue-900/10"></div>
        <div className="container mx-auto px-4 text-center z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-gradient">
            Connect. Create. Collaborate.
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Join a community of passionate students building the next big thing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-full font-semibold hover:from-violet-600 hover:to-indigo-600 transition-all duration-300 glow"
            >
              Get Started
            </Link>
            <Link
              href="/explore"
              className="px-8 py-4 glass rounded-full font-semibold transition-all duration-300 hover:bg-white/5 text-slate-200"
            >
              Explore Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-[#1e293b]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-20 bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
            Why Choose Synera?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl glass hover-card">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-400 to-violet-600 rounded-xl flex items-center justify-center mb-6 glow">
                <svg 
                  className="w-8 h-8 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  suppressHydrationWarning
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-slate-100">Find Your Team</h3>
              <p className="text-slate-300">Connect with like-minded students who share your passion and vision.</p>
            </div>
            <div className="p-8 rounded-2xl glass hover-card">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center mb-6 glow">
                <svg 
                  className="w-8 h-8 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  suppressHydrationWarning
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-slate-100">Build Projects</h3>
              <p className="text-slate-300">Turn your ideas into reality with collaborative project development.</p>
            </div>
            <div className="p-8 rounded-2xl glass hover-card">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-6 glow">
                <svg 
                  className="w-8 h-8 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  suppressHydrationWarning
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-slate-100">Grow Together</h3>
              <p className="text-slate-300">Learn from peers, share knowledge, and accelerate your growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/30 to-indigo-900/30"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-25"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-100">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-12 text-slate-300 max-w-2xl mx-auto">
            Join thousands of students already building amazing projects together.
          </p>
          <Link
            href="/signup"
            className="px-12 py-5 bg-slate-100 text-slate-900 rounded-full font-semibold hover:bg-white transition-all duration-300 inline-block glow"
          >
            Join the Community
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#1e293b]/50 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400">© 2024 Synera. All rights reserved.</p>
            <div className="flex gap-8 mt-6 md:mt-0">
              <Link href="/about" className="text-slate-400 hover:text-slate-200 transition-colors">About</Link>
              <Link href="/contact" className="text-slate-400 hover:text-slate-200 transition-colors">Contact</Link>
              <Link href="/privacy" className="text-slate-400 hover:text-slate-200 transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
