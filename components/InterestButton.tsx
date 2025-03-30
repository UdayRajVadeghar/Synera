'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface InterestButtonProps {
  projectId: string;
  hasExpressedInterest: boolean;
}

export default function InterestButton({ projectId, hasExpressedInterest }: InterestButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [hasInterest, setHasInterest] = useState(hasExpressedInterest);
  const router = useRouter();

  const handleExpressInterest = async () => {
    if (hasInterest) return;
    
    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch('/api/projects/interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        setHasInterest(true);
        // Refresh the page data
        router.refresh();
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
      console.error('Error expressing interest:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (hasInterest) {
    return (
      <div className="w-full px-4 py-3 bg-green-500/20 text-green-300 rounded-xl font-semibold text-center">
        You have expressed interest in this project
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleExpressInterest}
        disabled={isLoading}
        className={`w-full px-4 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl font-semibold 
          ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-violet-600 hover:to-indigo-600'} 
          transition-all duration-300`}
      >
        {isLoading ? 'Processing...' : 'Express Interest in Joining'}
      </button>
      
      {status === 'success' && (
        <p className="mt-2 text-sm text-green-400">{message}</p>
      )}
      
      {status === 'error' && (
        <p className="mt-2 text-sm text-red-400">{message}</p>
      )}
    </div>
  );
} 