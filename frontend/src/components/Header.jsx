import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function Header() {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null); // Ref para o container do menu e botão

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    // Efeito para fechar o dropdown se clicar fora dele
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        }
        // Adiciona o listener
        document.addEventListener("mousedown", handleClickOutside);
        // Função de limpeza para remover o listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <header className="main-header">
            <div className="page-title">
                <h2>Controle de Processos</h2>
                <p>Bem-vindo(a) de volta!</p>
            </div>
            {/* Usamos a ref no container do menu para detectar cliques fora dele */}
            <div className="user-info" id="user-menu-button" onClick={toggleDropdown} ref={dropdownRef}>
                <span>Olá, Usuário</span>
                <div className="user-avatar">
                    <i className="fa-solid fa-user"></i>
                </div>
                <i className="fa-solid fa-chevron-down"></i>
                <div id="user-menu-dropdown" className={`user-dropdown ${isDropdownVisible ? '' : 'hidden'}`}>
                    <Link to="/perfil" className="dropdown-item">
                        <i className="fa-solid fa-user-circle"></i>
                        <span>Meu Perfil</span>
                    </Link>
                    <Link to="/chamado" className="dropdown-item">
                        <i className="fa-solid fa-headset"></i>
                        <span>Abrir Chamado</span>
                    </Link>
                    <div className="dropdown-divider"></div>
                    <Link to="/login" className="dropdown-item dropdown-item-logout">
                        <i className="fa-solid fa-sign-out-alt"></i>
                        <span>Sair do Sistema</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;