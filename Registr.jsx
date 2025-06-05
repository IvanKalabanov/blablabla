import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import './Registr.css';

const Registr = () => {
  // Хуки должны вызываться на верхнем уровне компонента
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    email: '',
    lastName: '',
    firstName: '',
    middleName: '',
    gender: 'мужской'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Обработчик изменений формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Валидация
    if (!formData.email || !formData.password || !formData.login) {
      setError('Заполните все обязательные поля');
      return;
    }

    setLoading(true);
    
    try {
      // 1. Регистрация в Supabase Auth
      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            login: formData.login,
            first_name: formData.firstName,
            last_name: formData.lastName,
            gender: formData.gender
          }
        }
      });

      if (authError) throw authError;

      // 2. Добавление в таблицу users (если нужно)
      const { error: dbError } = await supabase
        .from('users')
        .insert([{
          id: user.id,
          email: user.email,
          login: formData.login,
          first_name: formData.firstName,
          last_name: formData.lastName,
          gender: formData.gender
        }]);

      if (dbError) throw dbError;

      navigate('/proj');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Ошибка регистрации. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/auth');
  };

  return (
    <div className="registration-container">
      <h2>Форма регистрации</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-label">Логин*</div>
          <input 
            type="text" 
            name="login" 
            value={formData.login} 
            onChange={handleChange} 
            placeholder="Введите логин" 
            className="form-input" 
            required 
          />
        </div>

        <div className="form-row">
          <div className="form-label">Пароль*</div>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            placeholder="Введите пароль (мин. 6 символов)" 
            className="form-input" 
            required 
            minLength="6"
          />
        </div>

        <div className="form-row">
          <div className="form-label">Email*</div>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Введите электронную почту" 
            className="form-input" 
            required 
          />
        </div>

        <div className="form-row">
          <div className="form-label">Фамилия*</div>
          <input 
            type="text" 
            name="lastName" 
            value={formData.lastName} 
            onChange={handleChange} 
            placeholder="Введите фамилию" 
            className="form-input" 
            required 
          />
        </div>

        <div className="form-row">
          <div className="form-label">Имя*</div>
          <input 
            type="text" 
            name="firstName" 
            value={formData.firstName} 
            onChange={handleChange} 
            placeholder="Введите своё имя" 
            className="form-input" 
            required 
          />
        </div>

        <div className="form-row">
          <div className="form-label">Отчество</div>
          <input 
            type="text" 
            name="middleName" 
            value={formData.middleName} 
            onChange={handleChange} 
            placeholder="Введите своё отчество" 
            className="form-input" 
          />
        </div>

        <div className="form-row">
          <div className="form-label">Пол*</div>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="мужской">Мужской</option>
            <option value="женский">Женский</option>
            <option value="другое">Другое</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
        
        <div className="login-link">
          Уже есть аккаунт? 
          <button 
            type="button" 
            className='log' 
            onClick={handleLoginRedirect}
            disabled={loading}
          >
            Войти
          </button>
        </div>
      </form>
    </div>
  );
};

export default Registr;