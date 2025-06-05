import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Registr from './Registr';
import Auth from './Authorization';
import ProjectManagement from './ProjectManagement';
import PersonalCabinet from './PersonalCabinet';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/registr" element={<Registr />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/proj" element={<ProjectManagement />} />
                    <Route path="/cabinet" element={<PersonalCabinet />} />
                    <Route path="*" element={<Auth />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;