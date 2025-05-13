import React, { useState, useEffect } from 'react';
import { sendToAppsScript, fetchMetalRates } from '../utils/api';

function LtvCalculator() {
  const [goldWt, setGoldWt] = useState('');
  const [goldPurity, setGoldPurity] = useState('');
  const [silverWt, setSilverWt] = useState('');
  const [silverPurity, setSilverPurity] = useState('');
  const [disbursed, setDisbursed] = useState('');
  const [goldRate, setGoldRate] = useState(0);
  const [silverRate, setSilverRate] = useState(0);
  const [ltv, setLtv] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch metal rates on component mount
  useEffect(() => {
    const getMetalRates = async () => {
      try {
        const rates = await fetchMetalRates();
        setGoldRate(rates.gold);
        setSilverRate(rates.silver);
      } catch (error) {
        console.error('Error fetching metal rates:', error);
        setError('Could not fetch metal rates. LTV calculation may be inaccurate.');
      }
    };
    getMetalRates();
  }, []);

  useEffect(() => {
    // Calculate LTV when inputs or rates change
    const calculateLTV = () => {
      const gw = parseFloat(goldWt);
      const gp = parseFloat(goldPurity);
      const sw = parseFloat(silverWt);
      const sp = parseFloat(silverPurity);
      const dis = parseFloat(disbursed);

      if (!isNaN(gw) && !isNaN(gp) && !isNaN(sw) && !isNaN(sp) && !isNaN(dis) && goldRate > 0 && silverRate > 0) {
        const calculatedLtv = dis / (
          gw * (gp / 100) * goldRate +
          sw * (sp / 100) * silverRate
        );
        setLtv(calculatedLtv * 100); // Convert to percentage
      } else {
        setLtv(null);
      }
    };

    calculateLTV();
  }, [goldWt, goldPurity, silverWt, silverPurity, disbursed, goldRate, silverRate]);

  const getLtvColor = () => {
    if (ltv === null) return '';
    if (ltv <= 50) return 'text-green-600';
    if (ltv > 50 && ltv <= 80) return 'text-lime-600'; // Using lime for light-green approximation
    if (ltv > 80 && ltv <= 85) return 'text-amber-600';
    if (ltv > 85 && ltv < 95) return 'text-red-600';
    if (ltv >= 95) return 'text-gray-500'; // Indicate locked state
    return '';
  };

  const isSaveDisabled = ltv !== null && ltv >= 95;

  const handleSave = async () => {
    if (isSaveDisabled) return;
    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success message

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: false, timeout: 8000 });
      });
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const valarUser = JSON.parse(localStorage.getItem('valarUser'));
      const userId = valarUser ? valarUser.phone : 'unknown';

      const loanEvent = {
        userId,
        lat,
        lon,
        ltv: ltv !== null ? ltv.toFixed(2) : null,
        ts: Date.now(),
        goldWt: parseFloat(goldWt) || 0,
        goldPurity: parseFloat(goldPurity) || 0,
        silverWt: parseFloat(silverWt) || 0,
        silverPurity: parseFloat(silverPurity) || 0,
        disbursed: parseFloat(disbursed) || 0,
      };

      // sendToAppsScript has built-in queueOffline fallback
      await sendToAppsScript(loanEvent, 'loanEvent'); // Assuming 'loanEvent' endpoint

      console.log('Loan event saved:', loanEvent);
      setSuccessMessage('Loan event saved successfully!');

    } catch (error) {
      console.error('Error saving loan event:', error);
      setError('Failed to save loan event. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">LTV Calculator</h2>
       {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
            <p>{successMessage}</p>
          </div>
        )}
      <div className="space-y-4">
        <div>
          <label htmlFor="goldWt" className="block text-sm font-medium text-gray-700">Gold Wt (g)</label>
          <input type="number" id="goldWt" step="0.001" value={goldWt} onChange={(e) => setGoldWt(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="goldPurity" className="block text-sm font-medium text-gray-700">Gold Purity (%)</label>
          <input type="number" id="goldPurity" step="0.01" value={goldPurity} onChange={(e) => setGoldPurity(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="silverWt" className="block text-sm font-medium text-gray-700">Silver Wt (g)</label>
          <input type="number" id="silverWt" step="0.001" value={silverWt} onChange={(e) => setSilverWt(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="silverPurity" className="block text-sm font-medium text-gray-700">Silver Purity (%)</label>
          <input type="number" id="silverPurity" step="0.01" value={silverPurity} onChange={(e) => setSilverPurity(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="disbursed" className="block text-sm font-medium text-gray-700">Disbursed ₹</label>
          <input type="number" id="disbursed" value={disbursed} onChange={(e) => setDisbursed(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
        </div>

        {ltv !== null && (
          <div className={`text-xl font-bold ${getLtvColor()}`}>
            LTV: {ltv.toFixed(2)} %
          </div>
        )}

        <div>
          <button
            onClick={handleSave}
            disabled={isSaveDisabled}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSaveDisabled ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default LtvCalculator;
