import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import {
  Home,
  FileText,
  Calendar,
  Users,
  Stethoscope
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { user } = useUser();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      title: 'Inicio',
      path: '/',
      icon: <Home size={20} />,
      roles: ['patient', 'admin', 'medical']
    },
    {
      title: 'Historias Clínicas',
      path: '/medical-records',
      icon: <FileText size={20} />,
      roles: ['patient', 'admin', 'medical']
    },
    {
      title: 'Citas Médicas',
      path: '/appointments',
      icon: <Calendar size={20} />,
      roles: ['patient']
    },
    {
      title: 'Servicios Médicos',
      path: '/medical-services',
      icon: <Stethoscope size={20} />,
      roles: ['medical']
    },
    {
      title: 'Gestión de Accesos',
      path: '/access-management',
      icon: <Users size={20} />,
      roles: ['admin']
    }
  ];

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(user.currentRole)
  );

  return (
    <aside className={`fixed inset-y-0 left-0 z-20 transform transition-transform duration-300 ease-in-out bg-essalud-darkblue border-gray-200 ${
      isOpen ? 'w-64' : 'w-13'
    } hidden md:block`}>
      <div className="h-full flex flex-col">
        <div className="flex items-center h-16  px-4">
          <Link to="/" className={`flex items-center ${!isOpen && 'justify-center'}`}>
            <div className={`flex-shrink-0 ${isOpen ? 'w-7' : 'w-8'}`}>
              <img
                src="/images/logo.png"
                alt="EsSalud"
                className="w-full h-auto cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125"
              />
            </div>
            {isOpen && <span className="ml-2 -mt-1 text-2xl font-bold text-white">EsSalud</span>}
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {filteredMenuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-essalud-blue text-essalud-orange'
                      : 'text-white hover:bg-essalud-hoverBlue'
                  }`}
                  title={!isOpen ? item.title : undefined}
                >
                  <span className={isActive(item.path) ? 'text-essalud-orange' : 'text-white'}>
                    {item.icon}
                  </span>
                  {isOpen && <span className="ml-3">{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {isOpen && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <img
                src={user.avatarUrl || "https://i.pravatar.cc/150?img=1"}
                alt={user.name}
                className="h-8 w-8 rounded-full"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-300 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar