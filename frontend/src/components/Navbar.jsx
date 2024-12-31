import React from "react";

const Navbar = ({ children }) => {
  return (
    <nav className="w-full bg-gray-800 p-4 flex items-center">
      <div className="text-xl font-bold text-white">Dashboard</div>
      {children}
    </nav>
  );
};

export default Navbar;
