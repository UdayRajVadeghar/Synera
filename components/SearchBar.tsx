'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface SearchSuggestions {
  titles: string[];
  techStacks: string[];
  categories: string[];
}

interface SearchBarProps {
  initialValue?: string;
  preserveParams?: boolean;
}

export default function SearchBar({ initialValue = '', preserveParams = true }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<SearchSuggestions | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const suggestionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query || query.length < 2) {
        setSuggestions(null);
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Debounce the API calls
    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node) && 
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (query.trim()) {
      // Build URL with current filters preserved
      const params = new URLSearchParams();
      
      // Add search query
      params.append('search', query.trim());
      
      // Preserve other parameters if needed
      if (preserveParams) {
        // Get all current search parameters except 'search'
        for (const [key, value] of Array.from(searchParams.entries())) {
          if (key !== 'search') {
            params.append(key, value);
          }
        }
      }
      
      router.push(`/projects?${params.toString()}`);
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    
    // Build URL with current filters preserved
    const params = new URLSearchParams();
    
    // Add search query
    params.append('search', suggestion);
    
    // Preserve other parameters if needed
    if (preserveParams) {
      // Get all current search parameters except 'search'
      for (const [key, value] of Array.from(searchParams.entries())) {
        if (key !== 'search') {
          params.append(key, value);
        }
      }
    }
    
    router.push(`/projects?${params.toString()}`);
    setShowSuggestions(false);
  };
  
  // Show suggestions only when we have results and input is focused
  const hasSuggestions = suggestions && (
    suggestions.titles.length > 0 || 
    suggestions.techStacks.length > 0 || 
    suggestions.categories.length > 0
  );
  
  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search projects, technologies..."
          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-4 pr-10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          aria-label="Search"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
        >
          {isLoading ? (
            <div className="h-5 w-5 border-t-2 border-slate-200 border-opacity-50 rounded-full animate-spin"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>
      </form>
      
      {/* Suggestions dropdown */}
      {showSuggestions && hasSuggestions && (
        <div 
          ref={suggestionRef}
          className="absolute z-30 mt-1 w-full bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-700"
        >
          <div className="max-h-80 overflow-y-auto">
            {suggestions.titles.length > 0 && (
              <div className="p-2">
                <div className="text-xs text-slate-400 font-semibold px-2 py-1">Projects</div>
                {suggestions.titles.map((title, index) => (
                  <div 
                    key={`title-${index}`}
                    onClick={() => handleSuggestionClick(title)}
                    className="px-3 py-2 hover:bg-slate-700 cursor-pointer text-slate-200 rounded"
                  >
                    {title}
                  </div>
                ))}
              </div>
            )}
            
            {suggestions.techStacks.length > 0 && (
              <div className="p-2 border-t border-slate-700">
                <div className="text-xs text-slate-400 font-semibold px-2 py-1">Technologies</div>
                {suggestions.techStacks.map((tech, index) => (
                  <div 
                    key={`tech-${index}`}
                    onClick={() => handleSuggestionClick(tech)}
                    className="px-3 py-2 hover:bg-slate-700 cursor-pointer text-slate-200 rounded"
                  >
                    <span className="px-2 py-1 bg-violet-500/20 text-violet-300 rounded-full text-xs mr-2">
                      {tech}
                    </span>
                    Search for projects using {tech}
                  </div>
                ))}
              </div>
            )}
            
            {suggestions.categories.length > 0 && (
              <div className="p-2 border-t border-slate-700">
                <div className="text-xs text-slate-400 font-semibold px-2 py-1">Categories</div>
                {suggestions.categories.map((category, index) => (
                  <div 
                    key={`category-${index}`}
                    onClick={() => handleSuggestionClick(category)}
                    className="px-3 py-2 hover:bg-slate-700 cursor-pointer text-slate-200 rounded"
                  >
                    <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs mr-2">
                      {category}
                    </span>
                    Browse {category} projects
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 