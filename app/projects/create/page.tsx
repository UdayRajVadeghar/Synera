'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CreateProject() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  const [formData, setFormData] = useState({
    name: '',
    projectTitle: '',
    description: '',
    requirements: '',
    techStack: [] as string[],
    teamSize: 2,
    timeframe: '1-3 months',
    difficulty: 'intermediate',
    category: 'web',
    customCategory: '',
    commitment: '10-20',
    communication: 'discord',
    githubRequired: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  // Fetch existing categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setExistingCategories(data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Standard category options plus "other"
  const standardCategories = [
    'web', 'mobile', 'ai/ml', 'blockchain',
    'game-dev', 'cybersecurity', 'data-science', 'other'
  ];

  // Combine standard categories with any unique existing categories from the database
  const categories = [...new Set([...standardCategories, ...existingCategories])];

  const difficulties = [
    'beginner', 'intermediate', 'advanced'
  ];

  const timeframes = [
    '< 1 month', '1-3 months', '3-6 months', '6+ months'
  ];

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData({...formData, category: value});
    setShowCustomCategory(value === 'other');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setServerError('');
      
      // Use custom category if selected "other" and provided a custom value
      const finalCategory = 
        formData.category === 'other' && formData.customCategory.trim() 
          ? formData.customCategory.trim().toLowerCase() 
          : formData.category;

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.projectTitle,
          description: formData.description,
          requirements: formData.requirements,
          techStack: formData.techStack,
          teamSize: formData.teamSize,
          timeframe: formData.timeframe,
          difficulty: formData.difficulty,
          category: finalCategory,
          commitment: formData.commitment,
          communication: formData.communication,
          githubRequired: formData.githubRequired,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Reset form data
      setFormData({
        name: '',
        projectTitle: '',
        description: '',
        requirements: '',
        techStack: [],
        teamSize: 2,
        timeframe: '1-3 months',
        difficulty: 'intermediate',
        category: 'web',
        customCategory: '',
        commitment: '10-20',
        communication: 'discord',
        githubRequired: false,
      });
      
      setSuccessMessage('Project created successfully!');
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Redirect to project page after a short delay
      setTimeout(() => {
        router.push(`/projects/${data.project.id}`);
      }, 2000);
      
    } catch (error) {
      console.error('Project creation error:', error);
      setServerError(error instanceof Error ? error.message : 'An unexpected error occurred');
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTechStackInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = (e.target as HTMLInputElement).value.trim();
      if (value && !formData.techStack.includes(value)) {
        setFormData({
          ...formData,
          techStack: [...formData.techStack, value]
        });
        (e.target as HTMLInputElement).value = '';
      }
    }
  };

  const removeTechStack = (tech: string) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter(t => t !== tech)
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0f172a] pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-100 mb-8">Create a Project</h1>
          
          {serverError && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
              {serverError}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg mb-6">
              {successMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6 bg-slate-800/50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-slate-100 mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="projectTitle" className="block text-sm font-medium text-slate-300 mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    id="projectTitle"
                    value={formData.projectTitle}
                    onChange={(e) => setFormData({...formData, projectTitle: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
                    Project Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Technical Requirements */}
            <div className="space-y-6 bg-slate-800/50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-slate-100 mb-4">Technical Requirements</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-slate-300 mb-2">
                    Project Requirements
                  </label>
                  <textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="List the main requirements and features of your project..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="techStack" className="block text-sm font-medium text-slate-300 mb-2">
                    Tech Stack (Press Enter or comma to add)
                  </label>
                  <input
                    type="text"
                    id="techStack"
                    onKeyDown={handleTechStackInput}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="e.g., React, Node.js, MongoDB..."
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full text-sm flex items-center"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechStack(tech)}
                          className="ml-2 text-violet-300 hover:text-violet-100"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2">
                    Project Category
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {showCustomCategory && (
                  <div>
                    <label htmlFor="customCategory" className="block text-sm font-medium text-slate-300 mb-2">
                      Specify Custom Category
                    </label>
                    <input
                      type="text"
                      id="customCategory"
                      value={formData.customCategory}
                      onChange={(e) => setFormData({...formData, customCategory: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      placeholder="Enter your custom category"
                      required={formData.category === 'other'}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-slate-300 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    {difficulties.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Team Requirements */}
            <div className="space-y-6 bg-slate-800/50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-slate-100 mb-4">Team Requirements</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="teamSize" className="block text-sm font-medium text-slate-300 mb-2">
                    Team Size (including you)
                  </label>
                  <input
                    type="number"
                    id="teamSize"
                    min="2"
                    max="10"
                    value={formData.teamSize}
                    onChange={(e) => setFormData({...formData, teamSize: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <label htmlFor="timeframe" className="block text-sm font-medium text-slate-300 mb-2">
                    Expected Timeframe
                  </label>
                  <select
                    id="timeframe"
                    value={formData.timeframe}
                    onChange={(e) => setFormData({...formData, timeframe: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    {timeframes.map((timeframe) => (
                      <option key={timeframe} value={timeframe}>
                        {timeframe}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="commitment" className="block text-sm font-medium text-slate-300 mb-2">
                    Weekly Time Commitment (hours)
                  </label>
                  <select
                    id="commitment"
                    value={formData.commitment}
                    onChange={(e) => setFormData({...formData, commitment: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="5-10">5-10 hours</option>
                    <option value="10-20">10-20 hours</option>
                    <option value="20-30">20-30 hours</option>
                    <option value="30+">30+ hours</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="communication" className="block text-sm font-medium text-slate-300 mb-2">
                    Preferred Communication
                  </label>
                  <select
                    id="communication"
                    value={formData.communication}
                    onChange={(e) => setFormData({...formData, communication: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="discord">Discord</option>
                    <option value="slack">Slack</option>
                    <option value="teams">Microsoft Teams</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="githubRequired"
                    checked={formData.githubRequired}
                    onChange={(e) => setFormData({...formData, githubRequired: e.target.checked})}
                    className="w-4 h-4 text-violet-500 border-slate-700 rounded focus:ring-violet-500"
                  />
                  <label htmlFor="githubRequired" className="ml-2 text-sm font-medium text-slate-300">
                    GitHub profile required
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-4 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-violet-600 hover:to-indigo-600 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Project...' : 'Create Project'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 