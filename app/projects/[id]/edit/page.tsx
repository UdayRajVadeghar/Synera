'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

interface ProjectFormData {
  title: string;
  description: string;
  requirements: string;
  techStack: string;
  teamSize: string;
  timeframe: string;
  difficulty: string;
  category: string;
  commitment: string;
  communication: string;
  githubRequired: boolean;
}

export default function EditProject({ params }: { params: { id: string } }) {
  const router = useRouter();
  const projectId = params.id;
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProject, setLoadingProject] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [categories, setCategories] = useState<string[]>([]);
  const [otherCategory, setOtherCategory] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    requirements: '',
    techStack: '',
    teamSize: '',
    timeframe: '',
    difficulty: 'beginner',
    category: '',
    commitment: '',
    communication: 'discord',
    githubRequired: false,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?redirect=/projects/${projectId}/edit`);
    } else if (status === 'authenticated') {
      setIsLoading(false);
      fetchProject();
      fetchCategories();
    }
  }, [status, router, projectId]);

  // Fetch project data
  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      
      const data = await response.json();
      
      // Check if the current user is the creator
      if (session?.user?.id !== data.creatorId) {
        router.push(`/projects/${projectId}`);
        return;
      }
      
      setFormData({
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        techStack: data.techStack.join(', '),
        teamSize: data.teamSize.toString(),
        timeframe: data.timeframe,
        difficulty: data.difficulty,
        category: data.category,
        commitment: data.commitment,
        communication: data.communication,
        githubRequired: data.githubRequired,
      });
      
      // Check if it's a custom category
      if (!['web', 'mobile', 'ai', 'game', 'blockchain', 'data', 'iot', 'ar/vr', 'other'].includes(data.category)) {
        setOtherCategory(true);
      }
      
      setLoadingProject(false);
    } catch (error) {
      console.error('Error fetching project:', error);
      setMessage({ type: 'error', text: 'Failed to load project data. Please try again.' });
      setLoadingProject(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, category: value }));
    setOtherCategory(value === 'other');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate the form
      if (!formData.title.trim()) {
        setMessage({ type: 'error', text: 'Project title is required' });
        setSubmitting(false);
        return;
      }

      // Prepare the data
      const techStackArray = formData.techStack
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const projectData = {
        ...formData,
        techStack: techStackArray,
        teamSize: parseInt(formData.teamSize),
      };

      // Submit the data
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Project updated successfully!' });
        // Smooth scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Redirect after short delay
        setTimeout(() => {
          router.push(`/projects/${projectId}`);
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update project' });
        // Smooth scroll to top to show error message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error updating project:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
      // Smooth scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || loadingProject) {
    return (
      <div className="min-h-screen bg-[#0f172a] pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto bg-slate-800/50 rounded-xl p-6">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href={`/projects/${projectId}`} className="text-slate-400 hover:text-violet-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Project
            </Link>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6 mb-8">
            <h1 className="text-3xl font-bold text-slate-100 mb-6">Edit Project</h1>
            
            {message.text && (
              <div className={`p-4 rounded-lg mb-6 ${message.type === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="Give your project a clear, descriptive title"
                  required
                />
              </div>

              {/* Project Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">
                  Project Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="Describe your project idea and goals"
                  required
                />
              </div>

              {/* Project Requirements */}
              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-slate-300 mb-1">
                  Project Requirements *
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="List specific requirements, features, or deliverables for your project"
                  required
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label htmlFor="techStack" className="block text-sm font-medium text-slate-300 mb-1">
                  Tech Stack *
                </label>
                <input
                  type="text"
                  id="techStack"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="React, Node.js, MongoDB, etc. (comma separated)"
                  required
                />
              </div>

              {/* Two-column layout for smaller fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Team Size */}
                <div>
                  <label htmlFor="teamSize" className="block text-sm font-medium text-slate-300 mb-1">
                    Team Size *
                  </label>
                  <input
                    type="number"
                    id="teamSize"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleInputChange}
                    min="1"
                    max="20"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Timeframe */}
                <div>
                  <label htmlFor="timeframe" className="block text-sm font-medium text-slate-300 mb-1">
                    Project Timeframe *
                  </label>
                  <input
                    type="text"
                    id="timeframe"
                    name="timeframe"
                    value={formData.timeframe}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="e.g., 2 weeks, 1 month"
                    required
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-slate-300 mb-1">
                    Difficulty Level *
                  </label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">
                    Project Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="web">Web Development</option>
                        <option value="mobile">Mobile App</option>
                        <option value="ai">AI / Machine Learning</option>
                        <option value="game">Game Development</option>
                        <option value="blockchain">Blockchain</option>
                        <option value="data">Data Science</option>
                        <option value="iot">IoT</option>
                        <option value="ar/vr">AR/VR</option>
                      </>
                    )}
                    <option value="other">Other (Custom)</option>
                  </select>
                  
                  {otherCategory && (
                    <input
                      type="text"
                      id="customCategory"
                      name="category"
                      value={formData.category === 'other' ? '' : formData.category}
                      onChange={handleInputChange}
                      className="w-full mt-2 bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="Specify custom category"
                      required={otherCategory}
                    />
                  )}
                </div>

                {/* Commitment */}
                <div>
                  <label htmlFor="commitment" className="block text-sm font-medium text-slate-300 mb-1">
                    Weekly Commitment (hours) *
                  </label>
                  <input
                    type="text"
                    id="commitment"
                    name="commitment"
                    value={formData.commitment}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="e.g., 5-10"
                    required
                  />
                </div>

                {/* Communication */}
                <div>
                  <label htmlFor="communication" className="block text-sm font-medium text-slate-300 mb-1">
                    Preferred Communication *
                  </label>
                  <select
                    id="communication"
                    name="communication"
                    value={formData.communication}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  >
                    <option value="discord">Discord</option>
                    <option value="slack">Slack</option>
                    <option value="teams">Microsoft Teams</option>
                    <option value="zoom">Zoom</option>
                    <option value="email">Email</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* GitHub Required */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="githubRequired"
                  name="githubRequired"
                  checked={formData.githubRequired}
                  onChange={handleCheckboxChange}
                  className="h-5 w-5 text-violet-500 rounded border-slate-600 focus:ring-violet-500 bg-slate-700/50"
                />
                <label htmlFor="githubRequired" className="ml-2 text-slate-300">
                  GitHub account required for team members
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                <Link
                  href={`/projects/${projectId}`}
                  className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-lg ${
                    submitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {submitting ? 'Updating...' : 'Update Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 