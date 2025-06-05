import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './PersonalCabinet.css';

const DataRow = ({ label, value }) => (
    <div className="data-row">
        <span className="data-label">{label}</span>
        <span className="dots">......</span>
        <span className="data-value">{value || 'Не указано'}</span>
    </div>
);

const PersonalCabinet = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (!authContext.user) {
            navigate('/auth');
        } else {
            const savedData = localStorage.getItem(`user_${authContext.user.id}`) || 
                             localStorage.getItem('currentUser');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                setUserData(parsedData);
                setEditForm(parsedData);
            }
        }
    }, [authContext.user, navigate]);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleEditClick = () => {
        setShowEditModal(true);
    };

    const handleBackToProject = () => {
        navigate ('/proj')
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

const saveChanges = () => {
    // Определяем только те поля, которые должны учитываться при расчете заполненности
    const relevantFields = [
        'lastName', 
        'firstName', 
        'middleName', 
        'email',
        'phone', 
        'gender', 
        'city', 
        'street',
        'house', 
        'building', 
        'birthDate'
    ];
    
    // Считаем заполненные поля из списка relevantFields
    const filledFields = relevantFields.filter(field => 
        editForm[field] && editForm[field] !== ''
    ).length;
    
    // Общее количество учитываемых полей
    const totalFields = relevantFields.length;
    
    // Рассчитываем процент заполнения (от 0 до 100)
    const completionPercentage = Math.round((filledFields / totalFields) * 100);
    const newCompletionStatus = `${completionPercentage}%`;
    
    const updatedData = {
        ...editForm,
        completionStatus: newCompletionStatus
    };
    
    setUserData(updatedData);
    localStorage.setItem(`user_${authContext.user.id}`, JSON.stringify(updatedData));
    localStorage.setItem('currentUser', JSON.stringify(updatedData));
    setShowEditModal(false);
};

    const confirmLogout = () => {
        authContext.logout();
        setShowLogoutModal(false);
    };

    if (!userData) {
        return <div>Загрузка данных...</div>;
    }

    return (
        <div className="personal-cabinet">
            <header className="cabinet-header">
                <div className="header-content">
                    <h1>Личный кабинет</h1>
                    <div className="header-actions">
                        <button className='back-btn' onClick={handleBackToProject}>К проектам</button>
                        <button className="logout-btn" onClick={handleLogoutClick}>Выйти</button>
                    </div>
                </div>
            </header>

            <main className="cabinet-main-content">
                <section className="user-info-section">
                    <div className="user-profile">
                        <h2 className="username">
                            {userData.lastName} {userData.firstName} {userData.middleName}
                        </h2>
                        <span className="completion-status">Заполнено на {userData.completionStatus}</span>
                    </div>
                    
                    <div className="user-actions">
                        <button className="action-btn" onClick={handleEditClick}>Редактировать данные</button>
                    </div>
                </section>

                <section className="user-data-section">
                    <div className="data-grid">
                        <DataRow label="Логин" value={userData.login} />
                        <DataRow label="Фамилия" value={userData.lastName} />
                        <DataRow label="Имя" value={userData.firstName} />
                        <DataRow label="Отчество" value={userData.middleName} />
                        <DataRow label="E-mail" value={userData.email} />
                        <DataRow label="Телефон" value={userData.phone} />
                        <DataRow label="Пол" value={userData.gender} />
                        <DataRow label="Город" value={userData.city} />
                        <DataRow label="Улица" value={userData.street} />
                        <DataRow label="Дом" value={userData.house} />
                        <DataRow label="Корпус" value={userData.building} />
                        <DataRow label="Дата рождения" value={userData.birthDate} />
                    </div>
                </section>
            </main>

            {showLogoutModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Подтверждение выхода</h3>
                        <p>Вы действительно хотите выйти из личного кабинета?</p>
                        <div className="modal-actions">
                            <button className="modal-btn confirm-btn" onClick={confirmLogout}>Да, выйти</button>
                            <button className="modal-btn cancel-btn" onClick={() => setShowLogoutModal(false)}>Отмена</button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="modal-overlay">
                    <div className="edit-modal">
                        <h3>Редактирование данных</h3>
                        <form className="edit-form">
                            <div className="form-column">
                                <div className="form-group">
                                    <label>Фамилия</label>
                                    <input type="text" name="lastName" value={editForm.lastName || ''} onChange={handleEditChange} />
                                </div>
                                <div className="form-group">
                                    <label>Имя</label>
                                    <input type="text" name="firstName" value={editForm.firstName || ''} onChange={handleEditChange} />
                                </div>
                                <div className="form-group">
                                    <label>Отчество</label>
                                    <input type="text" name="middleName" value={editForm.middleName || ''} onChange={handleEditChange} />
                                </div>
                                <div className="form-group">
                                    <label>E-mail</label>
                                    <input type="email" name="email" value={editForm.email || ''} onChange={handleEditChange} />
                                </div>
                            </div>
                            
                            <div className="form-column">
                                <div className="form-group">
                                    <label>Телефон</label>
                                    <input type="tel" name="phone" value={editForm.phone || ''} onChange={handleEditChange} />
                                </div>
                                <div className="form-group">
                                    <label>Пол</label>
                                    <select name="gender" value={editForm.gender || ''} onChange={handleEditChange}>
                                        <option value="">Не указано</option>
                                        <option value="мужской">Мужской</option>
                                        <option value="женский">Женский</option>
                                        <option value="другое">Другое</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Дата рождения</label>
                                    <input type="date" name="birthDate" value={editForm.birthDate || ''} onChange={handleEditChange} />
                                </div>
                            </div>
                            
                            <div className="form-column">
                                <div className="form-group">
                                    <label>Город</label>
                                    <input type="text" name="city" value={editForm.city || ''} onChange={handleEditChange} />
                                </div>
                                <div className="form-group">
                                    <label>Улица</label>
                                    <input type="text" name="street" value={editForm.street || ''} onChange={handleEditChange} />
                                </div>
                                <div className="form-group">
                                    <label>Дом</label>
                                    <input type="text" name="house" value={editForm.house || ''} onChange={handleEditChange} />
                                </div>
                                <div className="form-group">
                                    <label>Корпус</label>
                                    <input type="text" name="building" value={editForm.building || ''} onChange={handleEditChange} />
                                </div>
                            </div>
                            
                            <div className="modal-actions">
                                <button type="button" className="modal-btn confirm-btn" onClick={saveChanges}>Сохранить</button>
                                <button type="button" className="modal-btn cancel-btn" onClick={() => setShowEditModal(false)}>Отмена</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalCabinet;