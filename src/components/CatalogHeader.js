import React, { memo, useEffect, useState } from 'react';
import { Box, Flex, Button, Spacer, Image, IconButton, Text } from '@chakra-ui/react';
import { FaBell, FaShoppingCart, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CatalogHeader.css';

const CatalogHeader = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Перевірка авторизації користувача
    axios.get('http://localhost:5001/api/auth/user', { withCredentials: true })
      .then(response => setUser(response.data))
      .catch(() => setUser(null));
  }, []);

  const handleSteamLogin = () => {
    window.location.href = 'http://localhost:5001/auth/steam'; // URL для авторизації через Steam на бекенді
  };

  const handleLogout = () => {
    axios.post('http://localhost:5001/api/auth/logout', {}, { withCredentials: true })
      .then(() => setUser(null))
      .catch(error => console.error('Logout error', error));
  };

  return (
    <Box className="catalog-header" padding="10px" backgroundColor="#5e4305">
      <Flex alignItems="center" className="header-flex">
        {/* Логотип */}
        <Box className="header-logo" width="150px">
          <Image src="/path/to/logo.png" alt="Dota2 Market Logo" className="logo-img" />
        </Box>

        <Spacer />

        {/* Меню */}
        <Flex className="header-menu">
          <Button className="menu-item" variant="ghost" color="white" fontWeight="bold" onClick={() => navigate('/')}>Купити</Button>
          <Button className="menu-item" variant="ghost" color="white" fontWeight="bold" onClick={() => navigate('/inventory')}>Мої речі</Button>
          <Button className="menu-item" variant="ghost" color="white" fontWeight="bold">Як це працює</Button>
          <Button className="menu-item" variant="ghost" color="white" fontWeight="bold">Техпідтримка</Button>
        </Flex>

        <Spacer />

        {/* Вибір мови */}
        <Box className="language-select-wrapper" position="relative" width="100px">
          <select className="language-select" defaultValue="RU">
            <option value="ru">RU</option>
            <option value="ua">UA</option>
            <option value="en">EN</option>
          </select>
        </Box>

        <Spacer />

        {/* Інші елементи праворуч */}
        <Flex alignItems="center" className="header-right-icons">
          {user ? (
            <>
              <IconButton icon={<FaBell />} className="header-icon" aria-label="Notifications" variant="ghost" color="white" />
              <IconButton icon={<FaShoppingCart />} className="header-icon" aria-label="Cart" variant="ghost" color="white" />
              <IconButton icon={<FaCog />} className="header-icon" aria-label="Settings" variant="ghost" color="white" />
              <Text className="user-balance" color="white" ml={4} fontWeight="bold">{user.balance} $</Text>
              <Text className="username" color="white" ml={4} fontWeight="bold">{user.displayName}</Text>
              <Image src={user.avatar} alt="User Avatar" boxSize="40px" borderRadius="full" ml={4} />
              <Button className="menu-item" variant="ghost" color="white" fontWeight="bold" ml={4} onClick={handleLogout}>Вийти</Button>
            </>
          ) : (
            <Button className="menu-item" variant="ghost" color="white" fontWeight="bold" onClick={handleSteamLogin}>Авторизація через Steam</Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default memo(CatalogHeader);