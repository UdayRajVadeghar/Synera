'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
  creatorName: string;
  communicationMethod: string;
}

export default function ContactModal({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  creatorName,
  communicationMethod,
}: ContactModalProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setStatus('error');
      setStatusMessage('Please enter a message');
      return;
    }

    setSending(true);
    setStatus('idle');
    setStatusMessage('');

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setStatusMessage(data.message || 'Message sent successfully!');
        setMessage('');
        // Refresh the page data
        router.refresh();
        
        // Close modal after delay
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setStatus('error');
        setStatusMessage(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setStatusMessage('An error occurred. Please try again.');
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-slate-800 rounded-xl shadow-lg max-w-md w-full"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-100">Contact Team Leader</h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <p className="text-slate-300">
              You are contacting <span className="font-semibold text-violet-400">{creatorName}</span> about their project <span className="font-semibold text-violet-400">{projectTitle}</span>.
            </p>
          </div>

          <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
            <p className="text-slate-300 text-sm">
              <span className="font-semibold">Communication Method:</span> {communicationMethod.charAt(0).toUpperCase() + communicationMethod.slice(1)}
            </p>
            <p className="text-slate-300 text-sm mt-2">
              After sending this message, the team leader will contact you through their preferred communication channel.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">
                Your Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Introduce yourself and explain why you're interested in joining this project..."
                required
              />
            </div>

            {status !== 'idle' && (
              <div className={`p-3 rounded-lg mb-4 ${status === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                {statusMessage}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
                disabled={sending}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                className={`px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-lg ${
                  sending ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 