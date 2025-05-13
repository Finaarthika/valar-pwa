import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Onboarding from './components/Onboarding';
import SetShopLocation from './components/SetShopLocation';
import LtvCalculator from './components/LtvCalculator';

const AppRouter = () => {
  const valarUser = JSON.parse(localStorage.getItem('valarUser'));
  const hasShopLocation = valarUser && valarUser.lat && valarUser.lon; // Assuming lat/lon indicates shop location

  return (
    <Router>
      <Routes>
        <Route
          path="/onboarding"
          element={valarUser ? <Navigate to={hasShopLocation ? "/calc" : "/set-shop"} /> : <Onboarding />}
        />
        <Route
          path="/set-shop"
          element={valarUser ? (hasShopLocation ? <Navigate to="/calc" /> : <SetShopLocation />) : <Navigate to="/onboarding" />}
        />
        <Route
          path="/calc"
          element={valarUser ? (hasShopLocation ? <LtvCalculator /> : <Navigate to="/set-shop" />) : <Navigate to="/onboarding" />}
        />
        {/* Default redirect */}
        <Route
          path="*"
          element={<Navigate to={valarUser ? (hasShopLocation ? "/calc" : "/set-shop") : "/onboarding"} />}
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
