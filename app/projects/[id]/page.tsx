'use client';

import ContactModal from '@/components/ContactModal';
import InterestButton from '@/components/InterestButton';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Creator {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  githubUsername: string | null;
}

interface Project {
  id: string;
  title: string;
  description: string;
  requirements: string;
  techStack: string[];
  teamSize: number;
  timeframe: string;
  difficulty: string;
  category: string;
  commitment: string;
  communication: string;
  githubRequired: boolean;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  creator: Creator;
}

export default function ProjectDetails({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [hasExpressedInterest, setHasExpressedInterest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Fetch project details
        const response = await fetch(`/api/projects/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        
        const projectData = await response.json();
        setProject(projectData);
        
        // Check if the user has already expressed interest
        if (session?.user?.id) {
          const interestResponse = await fetch(`/api/projects/interest/check?projectId=${params.id}`);
          if (interestResponse.ok) {
            const interestData = await interestResponse.json();
            setHasExpressedInterest(interestData.hasInterest);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project. Please try again.');
        setIsLoading(false);
      }
    };
    
    if (status !== 'loading') {
      fetchProject();
    }
  }, [params.id, session?.user?.id, status]);
  
  // Check if the current user is the creator
  const isCreator = session?.user?.id === project?.creatorId;
  
  // Format the date
  const formattedDate = project ? new Date(project.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : '';
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-xl p-6">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#0f172a] pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-xl p-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-slate-100 mb-4">Project Not Found</h2>
              <p className="text-slate-400 mb-6">{error || 'The project you are looking for does not exist or has been removed.'}</p>
              <Link 
                href="/projects"
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
              >
                Back to Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href="/projects" className="text-slate-400 hover:text-violet-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Projects
            </Link>
          </div>

          {/* Project Header */}
          <div className="bg-slate-800/50 rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <h1 className="text-3xl font-bold text-slate-100 mb-2 md:mb-0">{project.title}</h1>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full text-sm">
                  {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                </span>
                <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm">
                  {project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)}
                </span>
              </div>
            </div>
            <p className="text-slate-400 mb-6">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.techStack.map((tech: string) => (
                <span key={tech} className="px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center mr-3">
                  <span className="text-lg font-bold text-violet-300">
                    {project.creator.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-slate-200 font-medium">{project.creator.name}</p>
                  <p className="text-sm text-slate-400">Posted on {formattedDate}</p>
                </div>
              </div>
              {isCreator && (
                <Link 
                  href={`/projects/${project.id}/edit`}
                  className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-200 rounded-lg"
                >
                  Edit Project
                </Link>
              )}
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold text-slate-100 mb-4">Project Requirements</h2>
                <div className="text-slate-300 whitespace-pre-wrap">
                  {project.requirements}
                </div>
              </div>
              
              <div className="bg-slate-800/50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-slate-100 mb-4">Communication</h2>
                {session ? (
                  <div>
                    <p className="text-slate-300 mb-4">
                      This project uses {project.communication.charAt(0).toUpperCase() + project.communication.slice(1)} for team communication.
                    </p>
                    {!isCreator && (
                      <button 
                        className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
                        onClick={() => setIsContactModalOpen(true)}
                      >
                        Contact Team Leader
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-slate-300 mb-4">
                      Please log in to get contact information for this project.
                    </p>
                    <Link 
                      href={`/login?redirect=/projects/${project.id}`}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg inline-block"
                    >
                      Log In
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold text-slate-100 mb-4">Team Details</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-400">Team Size</p>
                    <p className="text-slate-200">{project.teamSize} members</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Expected Timeline</p>
                    <p className="text-slate-200">{project.timeframe}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Weekly Commitment</p>
                    <p className="text-slate-200">{project.commitment} hours</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">GitHub Required</p>
                    <p className="text-slate-200">{project.githubRequired ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-slate-100 mb-4">Interested in joining?</h2>
                {session ? (
                  !isCreator ? (
                    <InterestButton 
                      projectId={project.id} 
                      hasExpressedInterest={hasExpressedInterest} 
                    />
                  ) : (
                    <div className="px-4 py-3 bg-slate-700 text-slate-400 rounded-xl font-semibold text-center">
                      You are the creator
                    </div>
                  )
                ) : (
                  <Link
                    href={`/login?redirect=/projects/${project.id}`}
                    className="w-full px-4 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-violet-600 hover:to-indigo-600 transition-all duration-300 text-center block"
                  >
                    Log In to Apply
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Related Projects */}
          <div className="bg-slate-800/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-slate-100 mb-6">Similar Projects</h2>
            <p className="text-slate-400 text-center py-8">
              More projects in this category coming soon.
            </p>
          </div>
          
          {/* Contact Modal */}
          {isContactModalOpen && (
            <ContactModal
              isOpen={isContactModalOpen}
              onClose={() => setIsContactModalOpen(false)}
              projectId={project.id}
              projectTitle={project.title}
              creatorName={project.creator.name || 'Project Creator'}
              communicationMethod={project.communication}
            />
          )}
        </div>
      </div>
    </div>
  );
} 