import { useEffect, useState } from "react";
import { useCurrentUser } from "../../app/CurrentUserContext";
import { getEmployeeTasks, completeTask } from "./api";
import type { DashboardTask } from "../../shared/types";
import { Spinner } from "../../shared/components/Spinner";

export const Checklist = () => {
  const { currentUser } = useCurrentUser();
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    const fetchTasks = async () => {
      if (!currentUser) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getEmployeeTasks(currentUser.id, currentUser.startDate);
        if (active) {
          setTasks(data);
          checkInitialBadges(data);
        }
      } catch (err: any) {
        if (active) {
          setError("Nu s-au putut incarca activitatile de onboarding. Asigura-te ca serverele sunt pornite.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchTasks();
    return () => {
      active = false;
    };
  }, [currentUser]);

  const checkInitialBadges = (allTasks: DashboardTask[]) => {
    const categories: ("FirstDay" | "FirstWeek" | "FirstMonth")[] = ["FirstDay", "FirstWeek", "FirstMonth"];
    const badgesToUnlock: string[] = [];

    categories.forEach(cat => {
      const catTasks = allTasks.filter(t => t.category === cat);
      if (catTasks.length > 0 && catTasks.every(t => t.status === "completed")) {
        badgesToUnlock.push(cat);
      }
    });

    setUnlockedBadges(badgesToUnlock);
  };

  const handleCompleteClick = async (task: DashboardTask) => {
    if (task.status === "completed" || task.status === "upcoming" || !task.employeeTaskProgressId) {
      return;
    }

    const progressId = task.employeeTaskProgressId;

    // Optimistic UI update
    const previousTasks = [...tasks];
    const updatedTasks = tasks.map(t => {
      if (t.id === task.id) {
        return { ...t, status: "completed" };
      }
      return t;
    });

    setTasks(updatedTasks);

    // Check if this completion unlocks a new badge
    const catTasks = updatedTasks.filter(t => t.category === task.category);
    if (catTasks.length > 0 && catTasks.every(t => t.status === "completed")) {
      if (!unlockedBadges.includes(task.category)) {
        setUnlockedBadges(prev => [...prev, task.category]);
      }
    }

    try {
      await completeTask(progressId);
    } catch (err) {
      // Revert state on error
      setTasks(previousTasks);
      checkInitialBadges(previousTasks);
      alert("Nu s-a putut salva modificarea. Te rugam sa reincerci.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-[#FCFAF6]">
        <Spinner size="lg" />
        <p className="text-[#57534E] mt-4 text-sm font-semibold">Se incarca activitatile...</p>
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

  const firstDayTasks = tasks.filter(t => t.category === "FirstDay");
  const firstWeekTasks = tasks.filter(t => t.category === "FirstWeek");
  const firstMonthTasks = tasks.filter(t => t.category === "FirstMonth");

  const getStats = (catTasks: DashboardTask[]) => {
    const total = catTasks.length;
    const completed = catTasks.filter(t => t.status === "completed").length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  };

  const dayStats = getStats(firstDayTasks);
  const weekStats = getStats(firstWeekTasks);
  const monthStats = getStats(firstMonthTasks);

  const getBadgeName = (category: string) => {
    if (category === "FirstDay") return "Day 1 Explorer Badge unlocked! 🏆";
    if (category === "FirstWeek") return "Week 1 Navigator Badge unlocked! 🏆";
    return "Month 1 Champion Badge unlocked! 🏆";
  };

  return (
    <div className="space-y-12 bg-[#FCFAF6]">
      {/* Header section - Editorial Title */}
      <div className="border-b border-black/10 pb-8">
        <h1 className="text-4xl font-extrabold text-[#1C1917] tracking-tight">
          Activitati de onboarding
        </h1>
        <p className="text-[#57534E] mt-2 text-sm max-w-lg font-medium">
          Urmareste si finalizeaza sarcinile tale de integrare. Bifeaza task-urile active cand sunt gata.
        </p>
      </div>

      {/* Celebratory banners (Badges unlocked) - Typographic style */}
      {unlockedBadges.length > 0 && (
        <div className="space-y-3">
          {unlockedBadges.map(badge => (
            <div key={badge} className="border border-[#1E3F20] bg-[#E8F1E9] p-4 text-[#1E3F20] font-bold text-sm tracking-wide uppercase">
              {getBadgeName(badge)}
            </div>
          ))}
        </div>
      )}

      {/* Task categories - 3 columns asymmetric layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Day 1 Section */}
        <div className="space-y-6">
          <div className="border-b border-black/10 pb-3 flex justify-between items-end">
            <h2 className="text-xl font-bold text-[#1C1917]">Prima zi</h2>
            <span className="text-xs font-bold text-[#57534E]">{dayStats.completed}/{dayStats.total} ({dayStats.percentage}%)</span>
          </div>
          <div className="w-full h-1 bg-[#E7E5E4]">
            <div className="h-full bg-[#1E3F20] transition-all duration-300" style={{ width: `${dayStats.percentage}%` }} />
          </div>

          <div className="space-y-6 pt-4">
            {firstDayTasks.map(task => (
              <TaskItem key={task.id} task={task} onComplete={handleCompleteClick} />
            ))}
          </div>
        </div>

        {/* Week 1 Section */}
        <div className="space-y-6">
          <div className="border-b border-black/10 pb-3 flex justify-between items-end">
            <h2 className="text-xl font-bold text-[#1C1917]">Prima saptamana</h2>
            <span className="text-xs font-bold text-[#57534E]">{weekStats.completed}/{weekStats.total} ({weekStats.percentage}%)</span>
          </div>
          <div className="w-full h-1 bg-[#E7E5E4]">
            <div className="h-full bg-[#1E3F20] transition-all duration-300" style={{ width: `${weekStats.percentage}%` }} />
          </div>

          <div className="space-y-6 pt-4">
            {firstWeekTasks.map(task => (
              <TaskItem key={task.id} task={task} onComplete={handleCompleteClick} />
            ))}
          </div>
        </div>

        {/* Month 1 Section */}
        <div className="space-y-6">
          <div className="border-b border-black/10 pb-3 flex justify-between items-end">
            <h2 className="text-xl font-bold text-[#1C1917]">Prima luna</h2>
            <span className="text-xs font-bold text-[#57534E]">{monthStats.completed}/{monthStats.total} ({monthStats.percentage}%)</span>
          </div>
          <div className="w-full h-1 bg-[#E7E5E4]">
            <div className="h-full bg-[#1E3F20] transition-all duration-300" style={{ width: `${monthStats.percentage}%` }} />
          </div>

          <div className="space-y-6 pt-4">
            {firstMonthTasks.map(task => (
              <TaskItem key={task.id} task={task} onComplete={handleCompleteClick} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

interface TaskItemProps {
  task: DashboardTask;
  onComplete: (task: DashboardTask) => void;
}

const TaskItem = ({ task, onComplete }: TaskItemProps) => {
  const isCompleted = task.status === "completed";
  const isCurrent = task.status === "current";
  const isUpcoming = task.status === "upcoming";

  return (
    <div
      onClick={() => !isCompleted && !isUpcoming && onComplete(task)}
      className={`group flex items-start gap-4 transition-all duration-200 ${
        isCompleted
          ? "opacity-50 line-through cursor-default"
          : isUpcoming
          ? "opacity-30 cursor-not-allowed"
          : "cursor-pointer"
      }`}
    >
      <span className="font-mono text-sm font-bold mt-0.5 text-[#1E3F20]">
        {isCompleted ? "[x]" : "[ ]"}
      </span>

      <div className="space-y-1">
        <h4 className={`text-sm font-bold ${isCurrent ? "text-[#1C1917]" : "text-[#57534E]"}`}>
          {task.title}
          {isCurrent && (
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#1E3F20] ml-2 border border-[#D2E2D4] bg-[#E8F1E9] px-1.5 py-0.5">
              Activ
            </span>
          )}
        </h4>
        <p className="text-xs text-[#57534E] leading-relaxed">
          {task.description}
        </p>
      </div>
    </div>
  );
};
