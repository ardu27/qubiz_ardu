import { useEffect, useState } from "react";
import { useCurrentUser } from "../../app/CurrentUserContext";
import { getDashboard } from "./api";
import type { DashboardResponse } from "../../shared/types";
import { BuddyCard } from "./components/BuddyCard";
import { Spinner } from "../../shared/components/Spinner";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const { currentEmployeeId } = useCurrentUser();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getDashboard(currentEmployeeId);
        if (active) {
          setData(result);
        }
      } catch (err: any) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Nu s-a putut incarca panoul de control. Asigura-te ca serviciile din backend sunt pornite."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (currentEmployeeId > 0) {
      loadDashboard();
    }
    return () => {
      active = false;
    };
  }, [currentEmployeeId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-[#FCFAF6]">
        <Spinner size="lg" />
        <p className="text-[#57534E] mt-4 text-sm font-semibold">Se incarca datele de onboarding...</p>
      </div>
    );
  }

  if (error || !data) {
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

  const { employee, tasks, summary } = data;

  // Calculate day in onboarding
  const startDate = new Date(employee.startDate);
  const today = new Date();
  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const currentDay = diffDays > 0 ? diffDays : 1;

  const currentTasks = tasks.filter((t) => t.status === "current");
  const upcomingTasks = tasks.filter((t) => t.status === "upcoming").slice(0, 3);
  const displayTasks = currentTasks.length > 0 ? currentTasks : upcomingTasks;

  return (
    <div className="space-y-16 bg-[#FCFAF6]">
      {/* Header section - Editorial Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/10 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1C1917] tracking-tight">
            Salut, {employee.fullName}
          </h1>
          <p className="text-[#57534E] mt-2 text-sm max-w-lg font-medium">
            Bun venit in echipa de {employee.departmentName}. Acesta este ghidul tau personalizat de integrare.
          </p>
        </div>
        <div className="text-left md:text-right">
          <span className="text-[10px] uppercase font-bold text-[#1E3F20] tracking-wider block">
            Evolutie Onboarding
          </span>
          <span className="text-lg font-bold text-[#1C1917] mt-0.5 block">
            Ziua {currentDay} de activitate
          </span>
        </div>
      </div>

      {/* Asymmetric Editorial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        {/* Left Column (Buddy & Next Steps) - Spans 2 */}
        <div className="lg:col-span-2 space-y-16">
          {employee.buddyId ? (
            <div className="border-b border-black/10 pb-16">
              <BuddyCard buddyId={employee.buddyId} userOfficeDays={employee.officeDays} />
            </div>
          ) : (
            <div className="py-8 border-b border-black/10 pb-16 text-center">
              <h3 className="text-lg font-bold text-[#1C1917] mb-2">Nu ai un buddy alocat inca</h3>
              <p className="text-[#57534E] text-sm max-w-sm mx-auto">
                Sistemul cauta colegul ideal din departamentul tau pentru a te asista in primele zile.
              </p>
            </div>
          )}

          {/* Next tasks preview - Editorial List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <h3 className="text-lg font-bold text-[#1C1917]">Activitati imediate</h3>
            </div>

            <div className="divide-y divide-black/10">
              {displayTasks.length > 0 ? (
                displayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="mt-1">
                      {task.status === "completed" ? (
                        <span className="text-[#1E3F20] font-bold text-xs uppercase tracking-widest">[finalizat]</span>
                      ) : (
                        <span className="text-[#57534E] font-bold text-xs uppercase tracking-widest">[activ]</span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1C1917]">{task.title}</h4>
                      <p className="text-xs text-[#57534E] mt-1">{task.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[#57534E] text-sm py-2">Ai terminat toate activitatile planificate!</p>
              )}
            </div>

            <div className="pt-4">
              <Link
                to="/checklist"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#1C1917] hover:text-[#1E3F20] transition-colors uppercase tracking-widest"
              >
                Vezi checklistul complet &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (Typographic Progress & Info) - Spans 1 */}
        <div className="space-y-16">
          {/* Progress Card - Refactored to pure typography */}
          <div className="border-b border-black/10 pb-16 lg:border-b-0 lg:pb-0">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#57534E] mb-6">Progresul tau</h3>
            
            <div className="flex flex-col">
              <span className="text-7xl font-serif font-black text-[#1C1917] leading-none tracking-tight">
                {summary.progressPercentage}%
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-[#57534E] mt-3">
                {summary.completedTasks} din {summary.totalTasks} task-uri finalizate
              </p>
            </div>
          </div>

          {/* Resources & Help Quick Access */}
          <div className="space-y-6">
            <div className="border-b border-black/10 pb-4">
              <h3 className="text-lg font-bold text-[#1C1917]">Resurse utile</h3>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-sm text-[#1C1917]">Employee Handbook</h4>
                <p className="text-xs text-[#57534E] mt-1">Ghidul complet al regulilor interne, beneficiilor si culturii companiei.</p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-[#1C1917]">IT Setup Guide</h4>
                <p className="text-xs text-[#57534E] mt-1">Ghid pas cu pas pentru configurarea laptopului si accesului in platforme.</p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/resources"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#1C1917] hover:text-[#1E3F20] transition-colors uppercase tracking-widest"
              >
                Acceseaza hub-ul de resurse &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
