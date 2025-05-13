import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendToAppsScript } from '../utils/api';

function Onboarding() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [shareLocation, setShareLocation] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // Basic validation
    if (!name || !phone || !email) {
      setError('Please fill in all required fields.');
      return;
    }

    // Phone number validation (basic check for 10 digits)
    if (!/^\d{10}$/.test(phone)) {
        setError('Please enter a valid 10-digit phone number.');
        return;
    }

    let lat = null;
    let lon = null;

    if (shareLocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: false, timeout: 8000 });
        });
        lat = position.coords.latitude;
        lon = position.coords.longitude;
      } catch (error) {
        console.error('Error getting geolocation:', error);
        setError('Could not get your location. Please try again or disable location sharing.');
        // Continue without location if getting it fails
      }
    }

    const profile = { name, phone, email, lat, lon, ts: Date.now() };

    try {
      // sendToAppsScript has built-in queueOffline fallback
      await sendToAppsScript(profile, 'register'); // Assuming 'register' endpoint for onboarding
      localStorage.setItem('valarUser', JSON.stringify(profile));
      navigate(lat && lon ? '/calc' : '/set-shop'); // Redirect based on location sharing
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Welcome to Valar</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            id="phone"
            autoComplete="tel-national"
            pattern="[0-9]{10}"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="shareLocation"
            checked={shareLocation}
            onChange={(e) => setShareLocation(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="shareLocation" className="ml-2 block text-sm text-gray-900">Share my shop location</label>
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

export default Onboarding;
