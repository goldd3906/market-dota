import logo from './logo.svg';
import './App.css';
import React from 'react';
import CatalogPage from './components/CatalogPage'; // шлях до вашого компонента
import CatalogHeader from './components/CatalogHeader';


function App() {
  return (
    <div>
      <CatalogPage />
    </div>
  );
}


export default App;
