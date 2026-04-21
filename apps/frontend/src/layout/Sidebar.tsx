import { Link, useLocation } from 'react-router-dom';
import { Button } from '../design-system/Button/Button';
import {
  IconDashboard,
  IconUser,
  IconHeart,
  IconUsers,
  IconPlus,
} from '../design-system/Icons';
import './Sidebar.css';

export function Sidebar() {
  const location = useLocation();

  const getNavItemClass = (path: string) => {
    return `nav-item ${location.pathname === path ? 'nav-item--active' : ''}`;
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <Link to="/dashboard" className={getNavItemClass('/dashboard')}>
          <IconDashboard size={20} />
          Dashboard
        </Link>
        <Link to="/personal" className={getNavItemClass('/personal')}>
          <IconUser size={20} />
          Personal
        </Link>
        <Link to="/couple" className={getNavItemClass('/couple')}>
          <IconHeart size={20} />
          Couple
        </Link>
        <span className="nav-item nav-item--disabled" aria-disabled="true">
          <IconUsers size={20} />
          Groups
        </span>
      </nav>

      <div className="sidebar-footer">
        <Link to="/expense/new" className="w-full">
          <Button
            variant="primary"
            size="md"
            icon={<IconPlus size={16} />}
            className="w-full"
          >
            New Expense
          </Button>
        </Link>
      </div>
    </aside>
  );
}
