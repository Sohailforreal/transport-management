import { useAuth } from '../../context/AuthContext'

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth()

  return (
    <div className="h-16 bg-gray-900 border-b border-gray-800 
                    flex items-center justify-between px-4 sticky top-0 z-30">
      {/* Menu button */}
      <button
        onClick={onMenuClick}
        className="text-gray-400 hover:text-white lg:hidden"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* Title */}
      <p className="text-white font-semibold text-sm lg:text-base">
        Transport Management System
      </p>

      {/* User avatar */}
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </span>
      </div>
    </div>
  )
}

export default Navbar