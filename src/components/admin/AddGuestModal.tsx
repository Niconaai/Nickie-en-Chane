'use client';

import { useState } from 'react';

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGuest: (name: string, isAdult: boolean) => void;
}

export default function AddGuestModal({ isOpen, onClose, onAddGuest }: AddGuestModalProps) {
  const [name, setName] = useState('');
  const [isAdult, setIsAdult] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddGuest(name.trim(), isAdult);
      setName('');
      setIsAdult(true);
      onClose();
    }
  };

  const handleClose = () => {
    setName('');
    setIsAdult(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Guest</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guest Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-gray-900"
                placeholder="Enter guest name"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isAdult}
                  onChange={(e) => setIsAdult(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">This guest is an adult</span>
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition-colors"
              >
                Add Guest
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}