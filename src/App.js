import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CatalogPage from './components/CatalogPage';
import CatalogHeader from './components/CatalogHeader';
import TradeInventoryPage from './components/TradeInventoryPage';
import SteamAuthReturn from './components/SteamAuthReturn';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Перевіряємо, чи є користувач авторизованим
    axios.get('/api/auth/user', { withCredentials: true })
      .then(response => setUser(response.data))
      .catch(() => setUser(null));
  }, []);

  return (
    <BrowserRouter>
      <CatalogHeader user={user} />
      <Routes>
      <Route path="/" element={<CatalogPage />} />
        <Route path="/inventory" element={<TradeInventoryPage />} />
        <Route path="/auth/steam/return" element={<SteamAuthReturn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
