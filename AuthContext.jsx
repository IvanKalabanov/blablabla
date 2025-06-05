import React, { createContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  // Пример исправленной функции регистрации в AuthContext.jsx
  const registr = async (email, password, login, firstName, lastName, gender) => {
  try {
    // 1. Регистрация в Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // 2. Получаем сессию (критически важно для RLS)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) throw new Error('Сессия не создана');

    // 3. Добавляем данные в таблицу users
    const { data, error: dbError } = await supabase
      .from('users')
      .insert([{
        id: user.id,
        email: user.email,
        login,
        first_name: firstName,
        last_name: lastName,
        gender,
        created_at: new Date().toISOString()
      }])
      .select();

    if (dbError) throw dbError;

    return data[0];
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};



    const login = async ({ email, password }) => {
      try {
        const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
          email,
         password
        });
      
        if (error) throw error;
      
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
      
          setUser({ ...user, ...data });
          return { ...user, ...data };
        } catch (error) {
        console.error('Login error:', error);
        throw new Error(error.message || 'Ошибка входа');
      }
    };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, supabase, registr, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};