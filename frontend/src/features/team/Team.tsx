import { useEffect, useState } from "react";
import { useCurrentUser } from "../../app/CurrentUserContext";
import { 
  getAllEmployees, 
  getDepartments, 
  getBookingsByDate, 
  createBooking, 
  deleteBooking 
} from "./api";
import type { DeskReservation } from "./api";
import type { Employee, Department } from "../../shared/types";
import { Spinner } from "../../shared/components/Spinner";

export const Team = () => {
  const { currentUser } = useCurrentUser();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [bookings, setBookings] = useState<{ [day: string]: DeskReservation[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);
  const [bookingInProgress, setBookingInProgress] = useState<string | null>(null);

  // Day mapping helpers
  const dayAbbrs = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const dayNamesRo: { [key: string]: string } = {
    Mon: "Luni",
    Tue: "Marti",
    Wed: "Miercuri",
    Thu: "Joi",
    Fri: "Vineri"
  };

  const getWeekDate = (dayAbbr: string) => {
    const today = new Date();
    const dayMap: { [key: string]: number } = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5 };
    const targetDayOfWeek = dayMap[dayAbbr] || 1;
    const currentDayOfWeek = today.getDay(); // 0 Sunday, 1 Monday...
    
    const mondayDiff = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayDiff);
    
    const targetDate = new Date(monday);
    targetDate.setDate(monday.getDate() + (targetDayOfWeek - 1));
    return targetDate;
  };

  const formatDateIso = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const mapDayToRo = (day: string) => dayNamesRo[day] || day;

  useEffect(() => {
    let active = true;
    const loadTeamData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [empData, deptData] = await Promise.all([
          getAllEmployees(),
          getDepartments()
        ]);
        
        // Fetch bookings for the 5 days
        const bookingsMap: { [day: string]: DeskReservation[] } = {};
        const bookingsResults = await Promise.all(
          dayAbbrs.map(async day => {
            const dateStr = formatDateIso(getWeekDate(day));
            try {
              const data = await getBookingsByDate(dateStr);
              return { day, data };
            } catch {
              return { day, data: [] };
            }
          })
        );

        bookingsResults.forEach(res => {
          bookingsMap[res.day] = res.data;
        });

        if (active) {
          setEmployees(empData);
          setDepartments(deptData);
          setBookings(bookingsMap);
          
          // Auto-select current user's department
          if (currentUser) {
            const userDept = deptData.find(
              d => d.id === currentUser.departmentId || d.name === currentUser.departmentName
            );
            if (userDept) {
              setSelectedDeptId(userDept.id);
            } else if (deptData.length > 0) {
              setSelectedDeptId(deptData[0].id);
            }
          }
        }
      } catch (err) {
        if (active) {
          setError("Nu s-au putut incarca datele. Asigura-te ca backend-ul (inclusiv Booking Service pe portul 5104) este pornit.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadTeamData();
    return () => {
      active = false;
    };
  }, [currentUser]);

  const handleReserve = async (day: string) => {
    if (!currentUser) return;
    setBookingInProgress(day);
    try {
      const dateStr = formatDateIso(getWeekDate(day));
      const deskNumber = 100 + Math.floor(Math.random() * 50);
      const newReservation = await createBooking(
        currentUser.id,
        currentUser.fullName,
        dateStr,
        deskNumber
      );

      // Update state locally
      setBookings(prev => ({
        ...prev,
        [day]: [...(prev[day] || []), newReservation]
      }));
    } catch (err: any) {
      alert(err.response?.data?.message || "Eroare la rezervarea locului.");
    } finally {
      setBookingInProgress(null);
    }
  };

  const handleCancel = async (day: string, bookingId: number) => {
    setBookingInProgress(day);
    try {
      await deleteBooking(bookingId);
      
      // Update state locally
      setBookings(prev => ({
        ...prev,
        [day]: (prev[day] || []).filter(b => b.id !== bookingId)
      }));
    } catch {
      alert("Eroare la anularea rezervarii.");
    } finally {
      setBookingInProgress(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-[#FCFAF6]">
        <Spinner size="lg" />
        <p className="text-[#57534E] mt-4 text-sm font-semibold">Se incarca calendarul echipei...</p>
      </div>
    );
  }

  if (error || !currentUser) {
    return (
      <div className="max-w-2xl mx-auto mt-12 px-4">
        <div className="border border-red-200 bg-[#FFF2CC] p-8 text-center rounded-none">
          <h2 className="text-xl font-bold text-stone-900 mb-2">Eroare de conexiune</h2>
          <p className="text-[#57534E] text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#1E3F20] hover:bg-[#2C572F] text-white font-semibold px-6 py-2.5 rounded-none text-sm transition-all duration-200 cursor-pointer"
          >
            Incearca din nou
          </button>
        </div>
      </div>
    );
  }

  const userOfficeDays = (currentUser.officeDays || "").split(",");
  const userDeptId = currentUser.departmentId;

  // Filter employees by department
  const filteredEmployees = selectedDeptId
    ? employees.filter(emp => emp.departmentId === selectedDeptId)
    : employees;

  // Find buddy if assigned
  const buddy = currentUser.buddyId
    ? employees.find(emp => emp.id === currentUser.buddyId)
    : null;

  // Calculate office overlaps for today
  const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayAbbr = dayMap[new Date().getDay()];
  
  const hasUserBookingToday = (bookings[todayAbbr] || []).some(b => b.employeeId === currentUser.id);
  const isUserInOfficeToday = userOfficeDays.includes(todayAbbr) || hasUserBookingToday;

  const teammatesInOfficeToday = employees.filter(emp => {
    if (emp.id === currentUser.id) return false;
    if (emp.departmentId !== userDeptId) return false;
    
    const empDays = (emp.officeDays || "").split(",");
    const hasEmpBooking = (bookings[todayAbbr] || []).some(b => b.employeeId === emp.id);
    return empDays.includes(todayAbbr) || hasEmpBooking;
  });

  const overlapMessage = isUserInOfficeToday
    ? teammatesInOfficeToday.length > 0
      ? `[Astazi esti la birou cu ${teammatesInOfficeToday.length} colegi din departamentul tau]`
      : "[Astazi esti la birou, dar niciun alt coleg de echipa nu este programat]"
    : "[Astazi lucrezi de acasa conform programului tau]";

  // Get icebreakers based on department
  const getBuddyIcebreakers = (deptName: string) => {
    const d = (deptName || "").toLowerCase();
    if (d.includes("eng") || d.includes("it") || d.includes("dev")) {
      return [
        "Intreaba-ma despre pipeline-urile noastre de CI/CD",
        "Hai sa bem o cafea miercuri si sa vorbim despre tech stack",
        "Cum facem review la cod in echipa noastra?"
      ];
    }
    return [
      "Intreaba-ma despre cum ne organizam saptamana de lucru",
      "Hai sa facem o intalnire online sa ne cunoastem!",
      "Cum decurge o zi obisnuita in echipa noastra?"
    ];
  };

  return (
    <div className="space-y-16 bg-[#FCFAF6]">
      {/* Header section - Editorial Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/10 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1C1917] tracking-tight">
            Echipa si programul hibrid
          </h1>
          <p className="text-[#57534E] mt-2 text-sm max-w-lg font-medium">
            Planifica interactiunile fizice cu echipa ta. Rezerva un birou sau vizualizeaza programul saptamanal.
          </p>
        </div>
        <div className="text-left md:text-right">
          <span className="text-xs font-bold text-[#1E3F20] tracking-wide block uppercase">
            Status Prezenta
          </span>
          <span className="text-sm font-bold text-[#1C1917] mt-0.5 block">
            {overlapMessage}
          </span>
        </div>
      </div>

      {/* 1. Buddy Highlight Section (Stays at the very top) */}
      {buddy && (
        <div className="border-b border-black/10 pb-16">
          <span className="text-[10px] uppercase font-bold text-[#57534E] tracking-widest block mb-2">
            Buddy-ul Tau Asignat
          </span>
          <h2 className="text-2xl font-serif font-black text-[#1C1917] tracking-tight">
            {buddy.fullName}
          </h2>
          <p className="text-[#57534E] text-xs font-semibold mt-0.5 mb-6">
            {buddy.department?.name || "Buddy"} • {buddy.email}
          </p>

          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold text-[#57534E] tracking-wider block">
              Icebreakers sugerate:
            </span>
            <ul className="space-y-2 text-xs text-[#57534E]">
              {getBuddyIcebreakers(buddy.department?.name || "").map((ib, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#1E3F20] font-bold">•</span>
                  <span>{ib}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 2. visual Monday-Friday calendar grid with interactive booking */}
      <div className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#57534E]">
          Calendar Saptamanal Birou ({departments.find(d => d.id === selectedDeptId)?.name || "Echipa"})
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 border-b border-black/10 pb-16">
          {dayAbbrs.map(day => {
            const staticUserDay = userOfficeDays.includes(day);
            const userBooking = (bookings[day] || []).find(b => b.employeeId === currentUser.id);
            const isUserPresent = staticUserDay || !!userBooking;

            // Get all other people present
            const staticTeammates = filteredEmployees.filter(emp => {
              if (emp.id === currentUser.id) return false;
              return (emp.officeDays || "").split(",").includes(day);
            });

            const bookedTeammates = (bookings[day] || []).filter(b => b.employeeId !== currentUser.id);

            // Combine names, avoid duplicates
            const allTeammatesPresent = new Map<string, string>(); // name -> extra label
            staticTeammates.forEach(t => allTeammatesPresent.set(t.fullName, "Program stabilit"));
            bookedTeammates.forEach(b => allTeammatesPresent.set(b.employeeName, `Rezervat (Birou ${b.deskNumber})`));

            return (
              <div key={day} className="space-y-3 pt-4 border-t border-black/10 first:border-t md:border-t border-black/10 flex flex-col justify-between min-h-[220px]">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-[#1C1917] tracking-tight">
                      {mapDayToRo(day)}
                    </span>
                    {isUserPresent && (
                      <span className="text-[8px] font-bold uppercase tracking-widest bg-[#E8F1E9] text-[#1E3F20] px-1 border border-[#D2E2D4]">
                        Prezent
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {allTeammatesPresent.size > 0 ? (
                      Array.from(allTeammatesPresent.entries()).map(([name, label]) => (
                        <div key={name} className="group relative">
                          <p className="text-xs text-[#57534E] font-medium truncate">
                            {name}
                          </p>
                          <span className="absolute left-0 bottom-full mb-1 hidden group-hover:block bg-[#1C1917] text-white text-[8px] px-2 py-0.5 whitespace-nowrap z-10">
                            {label}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-[#57534E]/60 italic">Niciun coleg la birou</p>
                    )}
                  </div>
                </div>

                {/* Booking actions */}
                <div className="pt-4 border-t border-black/5">
                  {userBooking ? (
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-[#1E3F20]">✓ Biroul #{userBooking.deskNumber}</p>
                      <button
                        onClick={() => handleCancel(day, userBooking.id)}
                        disabled={bookingInProgress !== null}
                        className="text-[10px] uppercase font-bold text-red-700 hover:text-red-900 cursor-pointer underline disabled:opacity-50"
                      >
                        [anuleaza]
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleReserve(day)}
                      disabled={bookingInProgress !== null}
                      className="text-[10px] uppercase font-bold text-[#1E3F20] hover:text-[#2C572F] cursor-pointer underline disabled:opacity-50"
                    >
                      {staticUserDay ? "[Rezerva birou specific]" : "[Rezerva loc]"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Department tab filters (Typographic) */}
      <div className="space-y-8">
        <div className="flex flex-wrap gap-6 border-b border-black/10 pb-4">
          <button
            onClick={() => setSelectedDeptId(null)}
            className={`text-xs font-bold uppercase tracking-widest pb-2 transition-all duration-200 cursor-pointer ${
              selectedDeptId === null
                ? "text-[#1C1917] border-b-2 border-[#1E3F20]"
                : "text-[#57534E] hover:text-[#1C1917]"
            }`}
          >
            Toti Colegii
          </button>
          {departments.map(dept => (
            <button
              key={dept.id}
              onClick={() => setSelectedDeptId(dept.id)}
              className={`text-xs font-bold uppercase tracking-widest pb-2 transition-all duration-200 cursor-pointer ${
                selectedDeptId === dept.id
                  ? "text-[#1C1917] border-b-2 border-[#1E3F20]"
                  : "text-[#57534E] hover:text-[#1C1917]"
              }`}
            >
              {dept.name}
            </button>
          ))}
        </div>

        {/* Teammates List - Flat Layout */}
        <div className="divide-y divide-black/10">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map(emp => {
              const empDays = (emp.officeDays || "").split(",");
              
              // Compute dynamic overlays: check common days including bookings
              const commonDays = dayAbbrs.filter(day => {
                const userHasBooking = (bookings[day] || []).some(b => b.employeeId === currentUser.id);
                const isUserPresent = userOfficeDays.includes(day) || userHasBooking;
                
                const empHasBooking = (bookings[day] || []).some(b => b.employeeId === emp.id);
                const isEmpPresent = empDays.includes(day) || empHasBooking;

                return isUserPresent && isEmpPresent;
              });

              const hasOverlap = commonDays.length > 0;

              return (
                <div key={emp.id} className="flex flex-col md:flex-row md:items-center justify-between py-6 first:pt-0 last:pb-0">
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-[#1C1917]">
                      {emp.fullName}
                      {emp.id === currentUser.id && (
                        <span className="text-[9px] font-bold uppercase tracking-widest bg-stone-200 text-stone-700 ml-2 px-1 py-0.5 border border-stone-300">
                          Tu
                        </span>
                      )}
                      {emp.id === currentUser.buddyId && (
                        <span className="text-[9px] font-bold uppercase tracking-widest bg-[#E8F1E9] text-[#1E3F20] ml-2 px-1 py-0.5 border border-[#D2E2D4]">
                          Buddy
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-[#57534E]">{emp.email} • {emp.departmentName || emp.department?.name || "Departament"}</p>
                  </div>

                  <div className="mt-4 md:mt-0 text-left md:text-right space-y-1">
                    <p className="text-xs text-[#1C1917] font-semibold">
                      Zile birou: {empDays.map(mapDayToRo).join(", ")}
                    </p>
                    {emp.id !== currentUser.id && hasOverlap && (
                      <p className="text-[10px] text-[#1E3F20] font-bold uppercase tracking-wider">
                        [se suprapune {commonDays.map(mapDayToRo).join(" & ")}]
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-[#57534E] py-4">Nu exista angajati in acest departament.</p>
          )}
        </div>
      </div>
    </div>
  );
};
