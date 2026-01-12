import { useState } from "react";
import { Button } from "../button/Button";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);
  return (
    <>
    <header className="mobile-header">
        <Button 
          className="menu-btn" 
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Abrir menu"
        >
        .
        </Button>
        
        <span style={{ fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          GestãoPro
        </span>
        
        <div style={{ width: 32 }}></div>
      </header>

      <div 
        className={`overlay ${isSidebarOpen ? 'visible' : ''}`} 
        onClick={closeSidebar}
      />

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        
        <div className="sidebar-header">
          <a href="/" className="brand-logo">
            GestãoPro
          </a>
          
          <Button className="close-sidebar-btn" onClick={closeSidebar}>
            close
          </Button>
        </div>

        <nav className="nav-menu">
          <NavLink 
            to="/teams" 
            className="nav-item"
            onClick={closeSidebar} // Fecha ao clicar no link
          >
            Equipes
          </NavLink>

          <NavLink 
            to="/users" 
            className="nav-item"
            onClick={closeSidebar}
          >
            Usuários
          </NavLink>
        </nav>
      </aside>
    </>
    
  );
}
export default SideBar;

