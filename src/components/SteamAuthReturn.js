import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SteamAuthReturn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Ваш код для авторизації
  }, [navigate]); // Додайте navigate в залежності
  

  return <div>Зачекайте, триває авторизація...</div>;
};

export default SteamAuthReturn;
