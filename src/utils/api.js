import { queueOffline } from './offlineQueue';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx12345/exec'; // TODO: Replace with your actual Apps Script URL
const METAL_RATES_URL = 'https://sheets.googleapis.com/v4/spreadsheets/1YpeV4GpJeedrYGHQgonuSL-Rf4kuQiwpPysdZL9B-vk/values/METAL%20RATE!A2:B2?key=YOUR_API_KEY'; // TODO: Replace YOUR_API_KEY

export const sendToAppsScript = async (data, endpoint) => {
  const url = `${APPS_SCRIPT_URL}${endpoint ? `?action=${endpoint}` : ''}`;
  console.log(`Attempting to send data to ${url}:`, data);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log(`Successfully sent data to ${url}`);
    return await response.json();
  } catch (error) {
    console.error(`Error sending data to ${url}:`, error);
    // Queue offline on failure
    await queueOffline({ url, method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    throw error; // Re-throw the error so the calling component can handle it
  }
};

export const fetchMetalRates = async () => {
  console.log('Fetching metal rates...');
  try {
    // TODO: Replace YOUR_API_KEY with your actual Google Sheets API key
    const response = await fetch(METAL_RATES_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Assuming the response structure is like { values: [['Gold', 5000], ['Silver', 70]] }
    // You might need to adjust parsing based on the actual API response
    const rates = {};
    if (data.values && data.values.length > 0) {
      data.values.forEach(row => {
        if (row[0] === 'Gold') rates.gold = parseFloat(row[1]);
        if (row[0] === 'Silver') rates.silver = parseFloat(row[1]);
      });
    }
    if (!rates.gold || !rates.silver) {
        throw new Error('Could not parse metal rates from API response.');
    }
    console.log('Fetched metal rates:', rates);
    return rates;
  } catch (error) {
    console.error('Error fetching metal rates:', error);
    throw error; // Re-throw the error
  }
};
