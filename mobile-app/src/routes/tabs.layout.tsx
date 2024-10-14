import { NavLink } from 'react-router-dom';
import { Outlet } from 'react-router';
import { FaRegSun, FaSearch, FaUsers } from 'react-icons/fa';

const tabs = [
  { path: '/tabs/search', icon: FaSearch },
  { path: '/tabs/history', icon: FaUsers },
  { path: '/tabs/profile', icon: FaRegSun },
];

export const TabsLayout: React.FC = () => (
  <div className="flex h-screen flex-col">
    <div className="flex-1 overflow-auto">
      <Outlet />
    </div>
    <nav className="fixed inset-x-0 bottom-0 flex h-12 w-full place-content-around items-center rounded-t-[20px] bg-white p-2.5 shadow-md-unblur shadow-black/25">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className="text-whiteSmoke_darker aria-[current=page]:text-primary"
        >
          <tab.icon className="size-5" />
        </NavLink>
      ))}
    </nav>
  </div>
);
