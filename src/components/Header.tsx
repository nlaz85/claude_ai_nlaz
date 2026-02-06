import { useLocation } from 'react-router-dom';
import { LogOut, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/content': 'Content Management',
  '/dealers': 'Dealer Management',
  '/categories': 'Categories',
  '/distribution': 'Content Distribution',
};

export function Header() {
  const { pathname } = useLocation();
  const { user, logout } = useApp();

  const title = pageTitles[pathname] || 'ShipYard CMS';

  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>
      <div className="header-actions">
        <button className="btn-icon" title="Notifications">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        <div className="header-user">
          <div className="avatar">{user.name.charAt(0)}</div>
          <span className="header-user-name">{user.name}</span>
        </div>
        <button className="btn-icon" onClick={logout} title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
