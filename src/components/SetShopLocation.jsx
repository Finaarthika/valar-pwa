import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendToAppsScript } from '../utils/api';

function SetShopLocation() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSetLocation = async () => {
    setError(null); // Clear previous errors
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: false, timeout: 8000 });
      });
      const shopLat = position.coords.latitude;
      const shopLon = position.coords.longitude;

      const valarUser = JSON.parse(localStorage.getItem('valarUser'));
      if (valarUser) {
        const updatedUser = { ...valarUser, lat: shopLat, lon: shopLon };
        localStorage.setItem('valarUser', JSON.stringify(updatedUser));

        // sendToAppsScript has built-in queueOffline fallback
        await sendToAppsScript({ userId: valarUser.phone, lat: shopLat, lon: shopLon }, 'setShop'); // Assuming 'setShop' endpoint

        navigate('/calc'); // Redirect to calculator after setting location
      } else {
        // Should not happen if routing is correct, but handle defensively
        console.error('User not found in localStorage during set shop location.');
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Error setting shop location:', error);
      setError('Could not set shop location. Please ensure location services are enabled and try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
        <p className="font-bold">⚠️ Stand inside your shop and press Set Shop Location.</p>
      </div>
       {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}
      <button
        onClick={handleSetLocation}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Set Shop Location
      </button>
    </div>
  );
}

export default SetShopLocation;
