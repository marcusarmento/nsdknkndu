import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
    { to: "/", icon: "fa-solid fa-inbox", text: "Controle de Processos" },
    { to: "/iniciar-processo", icon: "fa-solid fa-plus", text: "Iniciar Processo" },
    { to: "/retorno-programado", icon: "fa-solid fa-repeat", text: "Retorno Programado" },
    { to: "/pesquisa", icon: "fa-solid fa-search", text: "Pesquisa" },
    { to: "/base-conhecimento", icon: "fa-solid fa-book", text: "Base de Conhecimento" },
    { to: "/textos-padrao", icon: "fa-solid fa-quote-left", text: "Textos Padrão" },
    { to: "/modelos", icon: "fa-solid fa-paste", text: "Modelos" },
    { to: "/acompanhamento", icon: "fa-solid fa-star", text: "Acompanhamento Especial" },
    { to: "/blocos", icon: "fa-solid fa-file-signature", text: "Blocos de Assinatura" },
    { to: "/estatisticas", icon: "fa-solid fa-chart-pie", text: "Estatísticas" },
];

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h1 className="logo-sdi">SDI</h1>
            </div>
            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <NavLink 
                        key={item.to}
                        to={item.to} 
                        // NavLink adiciona a classe 'active' por padrão quando a rota corresponde
                        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                    >
                        <i className={item.icon}></i>
                        <span>{item.text}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;