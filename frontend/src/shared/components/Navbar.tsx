import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, CheckSquare, Users, BookOpen, LogOut } from "lucide-react";
import { useCurrentUser } from "../../app/CurrentUserContext";

export const Navbar = () => {
  const { currentUser, logout } = useCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const activeStyle = "flex items-center gap-2 px-4 py-2 rounded-xl text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]";
  const inactiveStyle = "flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent transition-all duration-300";

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-900/80 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center shadow-md shadow-indigo-500/20">
          <span className="font-black text-xl text-white tracking-wider">M</span>
        </div>
        <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Meridian Onboarding
        </span>
      </div>

      <div className="flex items-center gap-2">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
        >
          <LayoutDashboard size={18} />
          <span className="text-sm font-semibold">Dashboard</span>
        </NavLink>

        <NavLink
          to="/checklist"
          className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
        >
          <CheckSquare size={18} />
          <span className="text-sm font-semibold">Checklist</span>
        </NavLink>

        <NavLink
          to="/team"
          className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
        >
          <Users size={18} />
          <span className="text-sm font-semibold">Echipa</span>
        </NavLink>

        <NavLink
          to="/resources"
          className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
        >
          <BookOpen size={18} />
          <span className="text-sm font-semibold">Resurse</span>
        </NavLink>
      </div>

      {currentUser && (
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-200">{currentUser.fullName}</p>
            <p className="text-xs text-slate-500">{currentUser.departmentName || currentUser.department?.name || "Nou Angajat"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-300 cursor-pointer"
            title="Deconectare"
          >
            <LogOut size={18} />
          </button>
        </div>
      )}
    </nav>
  );
};
