import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-[#0f172a] pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-indigo-400 text-transparent bg-clip-text">
              About Synera
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Connecting students for collaborative learning and project development
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-slate-800/50 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Our Mission</h2>
            <p className="text-slate-300 mb-6">
              Synera was created with a simple yet powerful mission: to bridge the gap between 
              classroom learning and real-world application by fostering collaborative projects 
              among students from diverse backgrounds and skill sets.
            </p>
            <p className="text-slate-300">
              We believe that the best learning happens when students work together on meaningful projects, 
              share knowledge, and build connections that last beyond graduation. Our platform makes it easy 
              to find like-minded collaborators, launch exciting projects, and build a portfolio that showcases 
              your skills to future employers.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-slate-800/50 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">Find Collaborators</h3>
              <p className="text-slate-400">
                Connect with students who have complementary skills and shared interests
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">Launch Projects</h3>
              <p className="text-slate-400">
                Create or join projects across various disciplines and technology stacks
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">Build Your Portfolio</h3>
              <p className="text-slate-400">
                Showcase your contributions and completed projects to stand out to employers
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-slate-100 mb-8 text-center">How It Works</h2>
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-slate-800/50 rounded-full w-16 h-16 flex-shrink-0 flex items-center justify-center text-2xl font-bold text-violet-400">
                  1
                </div>
                <div className="flex-grow bg-slate-800/50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-slate-100 mb-2">Create Your Profile</h3>
                  <p className="text-slate-400">
                    Sign up and build your profile highlighting your skills, interests, and what you're looking to learn. 
                    Connect your GitHub account to showcase your existing work and make it easier for potential collaborators 
                    to find you.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-slate-800/50 rounded-full w-16 h-16 flex-shrink-0 flex items-center justify-center text-2xl font-bold text-violet-400">
                  2
                </div>
                <div className="flex-grow bg-slate-800/50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-slate-100 mb-2">Browse or Create Projects</h3>
                  <p className="text-slate-400">
                    Explore existing projects that match your interests and skill level, or create your own 
                    project listing if you have an idea you want to bring to life. Our detailed project 
                    specifications help ensure you find the right fit.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-slate-800/50 rounded-full w-16 h-16 flex-shrink-0 flex items-center justify-center text-2xl font-bold text-violet-400">
                  3
                </div>
                <div className="flex-grow bg-slate-800/50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-slate-100 mb-2">Collaborate and Build</h3>
                  <p className="text-slate-400">
                    Once your team is formed, use our built-in collaboration tools to communicate, manage tasks, and 
                    track progress. Synera helps you organize your workflow so you can focus on building something amazing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Join Now CTA */}
          <div className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Ready to Start Collaborating?</h2>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Join Synera today and connect with fellow students who share your passion for learning and building. 
              Create your free account in minutes and start exploring projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signup" 
                className="px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-lg"
              >
                Sign Up Free
              </Link>
              <Link 
                href="/projects" 
                className="px-8 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg"
              >
                Browse Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 