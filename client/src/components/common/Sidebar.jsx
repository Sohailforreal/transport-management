import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  LayoutDashboard, 
  Truck, 
  UserSquare2, 
  Package, 
  Route, 
  BarChart3, 
  MapPin, 
  Map, 
  LogOut 
} from 'lucide-react'

// Icon size config for consistent styling
const ICON_SIZE = 20

const adminLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={ICON_SIZE} /> },
  { path: '/admin/vehicles', label: 'Vehicles', icon: <Truck size={ICON_SIZE} /> },
  { path: '/admin/drivers', label: 'Drivers', icon: <UserSquare2 size={ICON_SIZE} /> },
  { path: '/admin/orders', label: 'Orders', icon: <Package size={ICON_SIZE} /> },
  { path: '/admin/routes', label: 'Routes', icon: <Route size={ICON_SIZE} /> },
  { path: '/admin/reports', label: 'Reports', icon: <BarChart3 size={ICON_SIZE} /> },
]

const managerLinks = [
  { path: '/manager/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={ICON_SIZE} /> },
  { path: '/manager/orders', label: 'Orders', icon: <Package size={ICON_SIZE} /> },
  { path: '/manager/tracking', label: 'Live Tracking', icon: <MapPin size={ICON_SIZE} /> },
]

const driverLinks = [
  { path: '/driver/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={ICON_SIZE} /> },
  { path: '/driver/trips', label: 'My Trips', icon: <Map size={ICON_SIZE} /> },
]

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const links = user?.role === 'admin'
    ? adminLinks
    : user?.role === 'manager'
    ? managerLinks
    : driverLinks

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-gray-900 
                 border-r border-gray-800 z-50 transform transition-transform
                 duration-300 ease-in-out flex flex-col
                 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                 lg:translate-x-0`}>

        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg width="20" height="12" viewBox="0 0 80 44" fill="none">
                <rect x="2" y="4" width="48" height="28" rx="3" fill="white"/>
                <rect x="50" y="10" width="26" height="22" rx="3" fill="white" opacity="0.8"/>
                <circle cx="18" cy="38" r="5" fill="white"/>
                <circle cx="40" cy="38" r="5" fill="white"/>
                <circle cx="62" cy="38" r="5" fill="white"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Transport MS</p>
              <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-b border-gray-800">
          <p className="text-white text-sm font-medium truncate">{user?.name}</p>
          <p className="text-gray-500 text-xs truncate">{user?.email}</p>
        </div>

        {/* Nav Links */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm
                 font-medium transition-colors
                 ${isActive
                   ? 'bg-blue-600 text-white'
                   : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                 }`
              }
            >
              <span className="flex-shrink-0">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                       text-sm font-medium text-red-400 hover:bg-red-500/10
                       transition-colors"
          >
            <span className="flex-shrink-0">
              <LogOut size={ICON_SIZE} />
            </span>
            Logout
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar
