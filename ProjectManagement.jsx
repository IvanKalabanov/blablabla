    import React, { useState, useEffect, useContext } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { AuthContext } from './AuthContext';
    import './ProjectManagement.css';

    const ProjectManagement = () => {
        const navigate = useNavigate();
        const authContext = useContext(AuthContext);
        const [newTaskTitle, setNewTaskTitle] = useState("");
        const [newProjectTitle, setNewProjectTitle] = useState("");
        const [showAddProject, setShowAddProject] = useState(false);
        const [projects, setProjects] = useState([]);

        if (!authContext) {
            console.error('AuthContext не доступен');
            navigate('/auth');
            return null;
        }

        const { user, logout } = authContext;

        useEffect(() => {
            if (!user) {
                navigate('/auth');
                return;
            }

            const savedProjects = localStorage.getItem(`projects_${user.id}`);
            if (savedProjects) {
                setProjects(JSON.parse(savedProjects));
            } else {
                setProjects([
                    {
                        id: 1,
                        title: "Веб-сайт компании",
                        status: "В работе",
                        tasks: [
                            {
                                id: 1,
                                title: "Дизайн главной страницы",
                                description: "Создать макет главной страницы с учётом брендинга",
                                status: "Завершена",
                                type: "Дизайн",
                                modified: new Date().toLocaleString('ru-RU')
                            }
                        ]
                    }
                ]);
            }
        }, [user, navigate]);

        useEffect(() => {
            if (user) {
                localStorage.setItem(`projects_${user.id}`, JSON.stringify(projects));
            }
        }, [projects, user]);

        const addTask = (projectId) => {
            if (!newTaskTitle.trim()) return;
            
            const newTask = {
                id: Date.now(),
                title: newTaskTitle,
                description: "",
                status: "Новая",
                type: "Разработка",
                modified: new Date().toLocaleString('ru-RU')
            };

            setProjects(projects.map(project => 
                project.id === projectId 
                    ? { 
                        ...project, 
                        tasks: [...project.tasks, newTask],
                        status: project.status === "Новый" ? "В работе" : project.status
                    } 
                    : project
            ));

            setNewTaskTitle("");
        };

        const addProject = () => {
            if (!newProjectTitle.trim()) return;
            
            const newProject = {
                id: Date.now(),
                title: newProjectTitle,
                status: "Новый",
                tasks: []
            };

            setProjects([...projects, newProject]);
            setNewProjectTitle("");
            setShowAddProject(false);
        };

        const deleteProject = (projectId) => {
            if (window.confirm("Вы уверены, что хотите удалить этот проект?")) {
                setProjects(projects.filter(project => project.id !== projectId));
            }
        };

        const toggleProjectStatus = (projectId) => {
            setProjects(projects.map(project => {
                if (project.id === projectId) {
                    const newStatus = project.status === "В работе" ? "Разработка завершена" : "В работе";
                    return {
                        ...project,
                        status: newStatus
                    };
                }
                return project;
            }));
        };

        const deleteTask = (projectId, taskId) => {
            setProjects(projects.map(project => {
                if (project.id === projectId) {
                    return {
                        ...project,
                        tasks: project.tasks.filter(task => task.id !== taskId)
                    };
                }
                return project;
            }));
        };

        const changeTaskStatus = (projectId, taskId, newStatus) => {
            setProjects(projects.map(project => {
                if (project.id === projectId) {
                    return {
                        ...project,
                        tasks: project.tasks.map(task => {
                            if (task.id === taskId) {
                                return {
                                    ...task,
                                    status: newStatus,
                                    modified: new Date().toLocaleString('ru-RU')
                                };
                            }
                            return task;
                        })
                    };
                }
                return project;
            }));
        };

        const changeTaskType = (projectId, taskId, newType) => {
            setProjects(projects.map(project => {
                if (project.id === projectId) {
                    return {
                        ...project,
                        tasks: project.tasks.map(task => {
                            if (task.id === taskId) {
                                return {
                                    ...task,
                                    type: newType,
                                    modified: new Date().toLocaleString('ru-RU')
                                };
                            }
                            return task;
                        })
                    };
                }
                return project;
            }));
        };

        const handleLogout = () => {
            logout();
        };

        const handleNavigateToPersonalCabinet = () => {
            navigate('/cabinet');
        };

        const getStatusBadge = (status) => {
            const statusClasses = {
                "В работе": "in-progress",
                "Разработка завершена": "completed",
                "Новая": "new",
                "Действительная": "valid",
                "Неактуальная": "invalid",
                "Завершена": "completed"
            };
            
            return (
                <span className={`status-badge ${statusClasses[status] || ''}`}>
                    {status}
                </span>
            );
        };

        if (!user) {
            return <div>Перенаправление на страницу авторизации...</div>;
        }

        return (
            <div className="project-management">
                <header className="app-header">
                    <h1>Управление проектами</h1>
                    <div className="header-actions">
                        <button 
                            onClick={handleNavigateToPersonalCabinet}
                            className="personal-cabinet-btn"
                        >
                            Личный кабинет
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="logout-btn"
                        >
                            Выйти
                        </button>
                    </div>
                </header>

                <div className="projects-container">
                    {projects.map(project => (
                        <div key={project.id} className="project-card">
                            <div className="project-header">
                                <h2>{project.title}</h2>
                                <div className="project-status">
                                    {getStatusBadge(project.status)}
                                    <span className="task-count">Задач: {project.tasks.length}</span>
                                </div>
                                <div className="project-actions">
                                    <button 
                                        onClick={() => toggleProjectStatus(project.id)}
                                        className={`status-toggle-btn ${project.status === "В работе" ? "complete-btn" : "reopen-btn"}`}
                                    >
                                        {project.status === "В работе" ? "Завершить разработку" : "Вернуть в работу"}
                                    </button>
                                    <button 
                                        onClick={() => deleteProject(project.id)}
                                        className="delete-project-btn"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>

                            <div className="tasks-container">
                                {project.tasks.map(task => (
                                    <div key={task.id} className="task-card">
                                        <div className="task-header">
                                            <h3>{task.title}</h3>
                                            <div className="task-actions">
                                                <select
                                                    value={task.status}
                                                    onChange={(e) => changeTaskStatus(project.id, task.id, e.target.value)}
                                                    className="status-select"
                                                >
                                                    <option value="Новая">Новая</option>
                                                    <option value="Действительная">Действительная</option>
                                                    <option value="Неактуальная">Неактуальная</option>
                                                    <option value="Завершена">Завершена</option>
                                                </select>
                                                <select
                                                    value={task.type}
                                                    onChange={(e) => changeTaskType(project.id, task.id, e.target.value)}
                                                    className="type-select"
                                                >
                                                    <option value="Разработка">Разработка</option>
                                                    <option value="Тест">Тест</option>
                                                    <option value="Ввод в эксплуатацию">Ввод в эксплуатацию</option>
                                                    <option value="Дизайн">Дизайн</option>
                                                </select>
                                                <button 
                                                    onClick={() => deleteTask(project.id, task.id)}
                                                    className="delete-task-btn"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                        <p className="task-description">{task.description}</p>
                                        <div className="task-footer">
                                            {getStatusBadge(task.status)}
                                            <span className="task-type">{task.type}</span>
                                            <span className="task-modified">Изменено: {task.modified}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="add-task-section">
                                <input
                                    type="text"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    placeholder="Название задачи"
                                    onKeyPress={(e) => e.key === 'Enter' && addTask(project.id)}
                                    className="task-input"
                                />
                                <button 
                                    onClick={() => addTask(project.id)}
                                    className="add-task-btn"
                                >
                                    + Добавить задачу
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="add-project-section">
                        {showAddProject ? (
                            <div className="add-project-form">
                                <input
                                    type="text"
                                    value={newProjectTitle}
                                    onChange={(e) => setNewProjectTitle(e.target.value)}
                                    placeholder="Название проекта"
                                    onKeyPress={(e) => e.key === 'Enter' && addProject()}
                                    autoFocus
                                    className="project-input"
                                />
                                <button onClick={addProject} className="confirm-add-btn">
                                    Добавить
                                </button>
                                <button 
                                    onClick={() => setShowAddProject(false)} 
                                    className="cancel-add-btn"
                                >
                                    Отмена
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setShowAddProject(true)}
                                className="add-project-btn"
                            >
                                + Добавить проект
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    export default ProjectManagement;