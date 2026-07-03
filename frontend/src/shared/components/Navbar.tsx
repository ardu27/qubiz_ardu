import { NavLink, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../app/CurrentUserContext";

export const Navbar = () => {
  const { currentUser, logout } = useCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const activeStyle = "py-1.5 text-xs font-bold uppercase tracking-widest text-[#1C1917] border-l-2 border-[#1E3F20] pl-4 transition-all duration-200 block";
  const inactiveStyle = "py-1.5 text-xs font-bold uppercase tracking-widest text-[#57534E] hover:text-[#1C1917] border-l-2 border-transparent pl-4 transition-all duration-200 block";

  return (
    <nav className="w-full md:w-64 md:min-h-screen md:sticky md:top-0 bg-[#FCFAF6] border-b md:border-b-0 md:border-r border-[#E7E5E4] p-8 flex flex-col justify-between z-40">
      <div className="space-y-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1E3F20] flex items-center justify-center rounded-none">
            <span className="font-serif font-black text-lg text-white">M</span>
          </div>
          <span className="font-serif font-bold text-lg tracking-tight text-[#1C1917]">
            Meridian
          </span>
        </div>

        <div className="flex flex-col gap-5">
          <NavLink to="/" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
            Dashboard
          </NavLink>

          <NavLink to="/checklist" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
            Checklist
          </NavLink>

          <NavLink to="/team" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
            Echipa
          </NavLink>

          <NavLink to="/resources" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
            Resurse
          </NavLink>
        </div>
      </div>

      {currentUser && (
        <div className="pt-8 border-t border-[#E7E5E4] mt-8 flex flex-col gap-4">
          <div>
            <p className="text-xs font-bold text-[#1C1917] tracking-tight">{currentUser.fullName}</p>
            <p className="text-[10px] text-[#57534E] uppercase font-bold tracking-wider mt-0.5">
              {currentUser.departmentName || currentUser.department?.name || "Nou Angajat"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-bold uppercase tracking-widest text-[#57534E] hover:text-[#C65911] transition-all duration-200 cursor-pointer self-start"
          >
            Iesire
          </button>
        </div>
      )}
    </nav>
  );
};
