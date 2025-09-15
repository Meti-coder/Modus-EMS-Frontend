// src/App.jsx

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function App() {
  const [showLogin, setShowLogin] = React.useState(true);

  return (

  
 <div>

      <Routes>
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/register" element={<RegisterForm/>} />
        <Route path="/" element={<LoginForm />} />
      </Routes>
    </div>

   
  );
}

export default App;
