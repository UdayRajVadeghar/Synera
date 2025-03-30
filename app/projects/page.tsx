import { prisma } from '@/lib/prisma';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  difficulty: string;
  category: string;
  teamSize: number;
  createdAt: Date;
  creator: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export default async function BrowseProjects({ 
  searchParams 
}: { 
  searchParams: { 
    category?: string;
    search?: string; 
  } 
}) {
  const selectedCategory = searchParams.category || 'All';
  const searchQuery = searchParams.search || '';

  // Build query filter
  let filter: any = {};
  
  // Add category filter if not "All"
  if (selectedCategory !== 'All') {
    filter.category = selectedCategory;
  }
  
  // Add search filter if provided
  if (searchQuery) {
    filter.OR = [
      { title: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
      { techStack: { hasSome: [searchQuery] } },
    ];
  }

  // Fetch projects from the database
  const projects = await prisma.project.findMany({
    where: filter,
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Get unique categories from existing projects
  const existingCategories = await prisma.project.findMany({
    select: {
      category: true,
    },
    distinct: ['category'],
  });

  // Create array of categories with 'All' at the beginning
  const categories = ['All', ...existingCategories.map((c: { category: string }) => c.category)];

  return (
    <div className="min-h-screen bg-[#0f172a] pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-slate-100">Browse Projects</h1>
            <Link 
              href="/projects/create"
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-lg transition-colors"
            >
              Create Project
            </Link>
          </div>

          {/* Search indicator */}
          {searchQuery && (
            <div className="mb-4">
              <p className="text-slate-300">
                Showing results for: <span className="text-violet-400 font-semibold">"{searchQuery}"</span>
                <Link 
                  href={selectedCategory !== 'All' ? `/projects?category=${selectedCategory}` : '/projects'} 
                  className="ml-2 text-slate-400 hover:text-white underline"
                >
                  Clear search
                </Link>
              </p>
            </div>
          )}

          {/* Filters */}
          <div className="bg-slate-800/50 p-4 rounded-xl mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/projects${category === 'All' ? '' : `?category=${category}`}${searchQuery ? `&search=${searchQuery}` : ''}`}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === selectedCategory 
                      ? 'bg-violet-500 text-white' 
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Link>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project: Project) => (
                <Link href={`/projects/${project.id}`} key={project.id}>
                  <div className="bg-slate-800/50 rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 h-full flex flex-col">
                    <div className="p-6 flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold text-slate-100 truncate">{project.title}</h2>
                        <span className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300">
                          {project.difficulty}
                        </span>
                      </div>
                      <p className="text-slate-400 mb-4 line-clamp-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.techStack.slice(0, 3).map((tech: string) => (
                          <span key={tech} className="px-2 py-1 bg-violet-500/20 text-violet-300 rounded-full text-xs">
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded-full text-xs">
                            +{project.techStack.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="border-t border-slate-700 p-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center mr-2">
                          <span className="text-xs font-bold text-violet-300">
                            {project.creator.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <span className="text-sm text-slate-300">{project.creator.name}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-400">
                        <span className="mr-2">{project.teamSize} members</span>
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/50 rounded-xl p-12 text-center">
              <h3 className="text-xl font-semibold text-slate-100 mb-2">No projects found</h3>
              <p className="text-slate-400 mb-6">
                {searchQuery 
                  ? `No projects match your search for "${searchQuery}". Try a different search term or create your own project.` 
                  : 'Be the first to create a project and start collaborating'}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {searchQuery && (
                  <Link 
                    href="/projects"
                    className="px-6 py-3 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 rounded-lg inline-block"
                  >
                    Clear Search
                  </Link>
                )}
                <Link 
                  href="/projects/create"
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-lg inline-block"
                >
                  Create Project
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 