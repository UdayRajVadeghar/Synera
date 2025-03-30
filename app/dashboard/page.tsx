import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  // Fetch user's projects
  const userProjects = await prisma.project.findMany({
    where: {
      creatorId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Get counts for stats
  const projectCount = userProjects.length;
  
  // This is a placeholder for team members count - would need a real team/members model
  const teamMembersCount = 0; 
  
  // These are placeholders - would need real models for messages and project status
  const messagesCount = 0;
  const completedCount = 0;
  
  return (
    <div className="min-h-screen bg-[#0f172a] pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-100 mb-8">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Profile Card */}
            <div className="bg-slate-800/50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-slate-100 mb-4">Your Profile</h2>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-violet-300">
                    {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-slate-100">{session.user.name}</h3>
                  <p className="text-slate-400">{session.user.email}</p>
                </div>
              </div>
              <div className="mt-6">
                <Link 
                  href="/profile/edit" 
                  className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors inline-block"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
            
            {/* Stats Card */}
            <div className="bg-slate-800/50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-slate-100 mb-4">Activity Overview</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm">Your Projects</p>
                  <p className="text-2xl font-bold text-slate-100">{projectCount}</p>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm">Team Members</p>
                  <p className="text-2xl font-bold text-slate-100">{teamMembersCount}</p>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm">Messages</p>
                  <p className="text-2xl font-bold text-slate-100">{messagesCount}</p>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-slate-100">{completedCount}</p>
                </div>
              </div>
            </div>
            
            {/* Projects Card */}
            <div className="bg-slate-800/50 p-6 rounded-xl md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-100">Your Projects</h2>
                <Link 
                  href="/projects/create" 
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-lg transition-colors"
                >
                  Create Project
                </Link>
              </div>
              
              {userProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userProjects.map((project: any) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                      <div className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors">
                        <h3 className="font-semibold text-slate-100 mb-2">{project.title}</h3>
                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {project.techStack.slice(0, 2).map((tech: string) => (
                            <span key={tech} className="px-2 py-1 bg-violet-500/20 text-violet-300 rounded-full text-xs">
                              {tech}
                            </span>
                          ))}
                          {project.techStack.length > 2 && (
                            <span className="px-2 py-1 bg-slate-600/50 text-slate-300 rounded-full text-xs">
                              +{project.techStack.length - 2}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-400">
                          <span>{project.difficulty}</span>
                          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-700/30 rounded-lg p-8 text-center">
                  <p className="text-slate-300 mb-4">You don't have any projects yet</p>
                  <p className="text-slate-400 text-sm mb-6">
                    Create a new project or join an existing one to start collaborating
                  </p>
                  <div className="flex justify-center gap-4">
                    <Link 
                      href="/projects/create" 
                      className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-lg transition-colors"
                    >
                      Create Project
                    </Link>
                    <Link 
                      href="/projects" 
                      className="px-4 py-2 bg-slate-600/50 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
                    >
                      Browse Projects
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 