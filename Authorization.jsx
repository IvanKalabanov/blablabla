import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { supabase } from './supabase'; 
import './Authorization.css';

const Authorization = () => {
  const navigate = useNavigate();
  const { login, supabase } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login(formData);
      navigate('/cabinet');
    } catch (error) {
      console.error("Ошибка авторизации:", error);
      alert("Неверный email или пароль");
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
      });
      if (error) throw error;
    } catch (error) {
      console.error('Google auth error:', error);
      alert('Ошибка авторизации через Google');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/registr');
  };

  return (
    <div className="auth-container">
      <h2>Авторизация</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Почта</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="Введите почту" 
            value={formData.email} 
            onChange={handleChange} 
            className="form-input" 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Пароль</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="Введите пароль" 
            value={formData.password} 
            onChange={handleChange} 
            className="form-input" 
            required 
          />
        </div>

        <button type="submit" className="submit-btn">Войти</button>
        
        <div className="divider">или</div>
        
        <button 
          type="button" 
          className="google-btn"
          onClick={handleGoogleAuth}
        >
          <svg className="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Войти с помощью Google
        </button>

        <div className="register-prompt">
          Нет аккаунта? 
          <button 
            type="button" 
            className="register-link" 
            onClick={handleRegisterRedirect}
          >
            Зарегистрируйтесь!
          </button>
        </div>
      </form>
    </div>
  );
};

export default Authorization;