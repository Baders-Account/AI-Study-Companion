import React from "react";

function Header({ appName, navigationItems, userName, onNavClick, showNotifications = true }) {
  return (
    <header className="w-full bg-white border-b border-neutral-200 flex justify-center py-3 px-6">
      <div className="max-w-7xl w-full flex justify-between items-center">
       
        <h1 className="text-xl font-semibold text-neutral-900">{appName}</h1>

      
        <nav
          className="flex gap-6"
          role="navigation"
          aria-label="Main navigation"
        >
          {navigationItems?.map((item, index) => (
            <button
              key={index}
              onClick={() => onNavClick?.(item.label)}
              className={`text-base ${
                item.active
                  ? "text-neutral-900 border-b-2 border-neutral-900"
                  : "text-neutral-500 hover:text-neutral-800"
              } transition-colors pb-1`}
              aria-current={item.active ? "page" : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>

        
        <div className="flex items-center gap-4">
          {showNotifications && (
            <button
              aria-label="Notifications"
              type="button"
              className="text-sm text-neutral-700 hover:text-neutral-900"
            >
           
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-700 font-medium">
              {userName}
            </span>
            <button
              aria-label="User menu"
              className="text-neutral-500 hover:text-neutral-800"
            >
             
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
