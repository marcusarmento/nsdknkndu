import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

function Layout() {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <Header />
                {/* O Outlet renderiza o componente da rota filha (ex: Dashboard) */}
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;