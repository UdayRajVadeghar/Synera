'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SocialLink {
  platform: string;
  url: string;
}

export default function EditProfile() {
  const router = useRouter();
  const { data: session, status, update } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    githubUsername: '',
    links: [] as SocialLink[],
  });

  const [newLink, setNewLink] = useState({
    platform: 'github',
    url: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/user/profile');
          if (response.ok) {
            const userData = await response.json();
            setProfileData({
              name: userData.name || '',
              email: userData.email || '',
              bio: userData.bio || '',
              githubUsername: userData.githubUsername || '',
              links: userData.links || [],
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    if (session) {
      fetchUserData();
    }
  }, [session]);

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLink.url) {
      setProfileData({
        ...profileData,
        links: [...profileData.links, { ...newLink }],
      });
      setNewLink({ platform: 'github', url: '' });
    }
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = [...profileData.links];
    updatedLinks.splice(index, 1);
    setProfileData({ ...profileData, links: updatedLinks });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setMessage({ type: '', text: '' });
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Update session with new user data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: profileData.name,
        },
      });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'An unexpected error occurred' 
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-100 mb-8">Edit Your Profile</h1>
          
          {message.text && (
            <div className={`${
              message.type === 'error' 
                ? 'bg-red-500/20 border-red-500 text-red-300' 
                : 'bg-green-500/20 border-green-500 text-green-300'
              } px-4 py-3 rounded-lg border mb-6`}
            >
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6 bg-slate-800/50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-slate-100 mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-4 py-2 bg-slate-900/30 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-slate-500">Email cannot be changed</p>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label htmlFor="githubUsername" className="block text-sm font-medium text-slate-300 mb-2">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    id="githubUsername"
                    value={profileData.githubUsername}
                    onChange={(e) => setProfileData({...profileData, githubUsername: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="e.g., octocat"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-6 bg-slate-800/50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-slate-100 mb-4">Social Links</h2>
              
              <div className="space-y-4">
                {/* Existing Links */}
                {profileData.links.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Your Links
                    </label>
                    {profileData.links.map((link, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-slate-700/30 p-2 rounded-lg">
                        <div className="flex-grow flex items-center">
                          <span className="px-2 py-1 bg-slate-600/50 rounded text-xs text-slate-300 mr-2">
                            {link.platform}
                          </span>
                          <span className="text-slate-300 text-sm truncate">{link.url}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(index)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Link */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Add New Link
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={newLink.platform}
                      onChange={(e) => setNewLink({...newLink, platform: e.target.value})}
                      className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="github">GitHub</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="twitter">Twitter</option>
                      <option value="portfolio">Portfolio</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="url"
                      value={newLink.url}
                      onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                      placeholder="https://"
                      className="flex-grow px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-4 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-violet-600 hover:to-indigo-600 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 