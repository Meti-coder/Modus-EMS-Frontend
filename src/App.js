// src/App.jsx

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import UserTable from './components/Dashboard';
import AddEmployeeForm from './components/AddEmployeeForm';
import EditEmployeeForm from './components/EditEmployeeForm';


function App() {
  const [showLogin, setShowLogin] = React.useState(true);

  return (

  
 <div>

      <Routes>

        <Route path="/login" element={<LoginForm/>} />
        <Route path="/register" element={<RegisterForm/>} />
        <Route path="/" element={<LoginForm />} />
         <Route path="/home" element={<UserTable />} />
         <Route path="/addEmployeeForm" element={<AddEmployeeForm />} />
         <Route path="/editEmployee/:id" element={<EditEmployeeForm />} />


      </Routes>
    </div>

   
  );
}

export default App;
