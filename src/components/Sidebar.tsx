import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  FolderTree,
  Share2,
  Anchor,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/content', icon: FileText, label: 'Content' },
  { to: '/dealers', icon: Users, label: 'Dealers' },
  { to: '/categories', icon: FolderTree, label: 'Categories' },
  { to: '/distribution', icon: Share2, label: 'Distribution' },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Anchor size={28} />
        <span>ShipYard CMS</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
            }
            end={item.to === '/'}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p className="sidebar-footer-text">ShipYard CMS v1.0</p>
      </div>
    </aside>
  );
}
