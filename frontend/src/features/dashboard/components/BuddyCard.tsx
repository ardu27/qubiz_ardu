import { useEffect, useState } from "react";
import { Badge } from "../../../shared/components/Badge";
import { Spinner } from "../../../shared/components/Spinner";
import apiClient from "../../../shared/lib/apiClient";
import type { Employee } from "../../../shared/types";

interface BuddyCardProps {
  buddyId: number;
  userOfficeDays: string;
}

export const BuddyCard = ({ buddyId, userOfficeDays }: BuddyCardProps) => {
  const [buddy, setBuddy] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [slackAlert, setSlackAlert] = useState(false);
  const [emailAlert, setEmailAlert] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchBuddy = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await apiClient.get<Employee>(`/employees/${buddyId}`);
        if (active) {
          setBuddy(response.data);
        }
      } catch (err) {
        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchBuddy();
    return () => {
      active = false;
    };
  }, [buddyId]);

  if (loading) {
    return (
      <div className="py-8 flex items-center justify-center h-48">
        <Spinner size="md" />
      </div>
    );
  }

  if (error || !buddy) {
    return (
      <div className="py-6">
        <p className="text-[#57534E] text-sm">Nu s-au putut incarca detaliile despre buddy.</p>
      </div>
    );
  }

  const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayAbbr = dayMap[new Date().getDay()];
  
  const userDays = userOfficeDays.split(",");
  const buddyDays = (buddy.officeDays || "").split(",");
  
  const isOverlapToday = userDays.includes(todayAbbr) && buddyDays.includes(todayAbbr);
  const commonDays = userDays.filter(d => buddyDays.includes(d));

  const mapDayToRo = (day: string) => {
    const ro: { [key: string]: string } = {
      Mon: "Luni",
      Tue: "Marti",
      Wed: "Miercuri",
      Thu: "Joi",
      Fri: "Vineri",
      Sat: "Sambata",
      Sun: "Duminica"
    };
    return ro[day] || day;
  };

  const overlapText = commonDays.length > 0 
    ? commonDays.map(mapDayToRo).join(" & ") + " - La birou"
    : "Nu aveti zile comune programate la birou";

  const getIcebreakers = (dept: string) => {
    const d = (dept || "").toLowerCase();
    if (d.includes("eng") || d.includes("it") || d.includes("dev")) {
      return [
        "Intreaba-ma despre pipeline-urile noastre de CI/CD",
        "Hai sa bem o cafea miercuri si sa vorbim despre tech stack",
        "Cum facem review la cod in echipa noastra?"
      ];
    }
    if (d.includes("sale") || d.includes("vanzari")) {
      return [
        "Intreaba-ma cum gestionam oportunitatile in CRM",
        "Hai sa luam pranzul miercuri!",
        "Cum abordam primele interactiuni cu clientii?"
      ];
    }
    if (d.includes("mark") || d.includes("pr")) {
      return [
        "Intreaba-ma despre campaniile noastre active",
        "Ce brand guidelines folosim in materiale?",
        "Hai sa facem o scurta prezentare a echipei saptamana asta!"
      ];
    }
    if (d.includes("hr") || d.includes("rec")) {
      return [
        "Intreaba-ma despre pachetul tau de beneficii",
        "Cum rezolvi problemele administrative rapide?",
        "Hai sa vorbim despre feedback-ul la 30 de zile!"
      ];
    }
    return [
      "Intreaba-ma despre cum ne organizam saptamana de lucru",
      "Hai sa facem o intalnire online sa ne cunoastem!",
      "Cum decurge o zi obisnuita in echipa noastra?"
    ];
  };

  const icebreakers = getIcebreakers(buddy.departmentName || "");

  const handleSlackClick = () => {
    setSlackAlert(true);
    setTimeout(() => setSlackAlert(false), 3000);
  };

  const handleEmailClick = () => {
    setEmailAlert(true);
    setTimeout(() => setEmailAlert(false), 3000);
  };

  return (
    <div className="py-4">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#57534E] tracking-widest block mb-1">
            Colegul tau de sprijin
          </span>
          <h3 className="text-3xl font-bold text-[#1C1917] tracking-tight">{buddy.fullName}</h3>
          <p className="text-[#57534E] text-xs font-semibold mt-0.5">{buddy.departmentName || "Departament"}</p>
        </div>

        {isOverlapToday && (
          <Badge variant="success" className="py-1 px-3 self-start md:self-auto">
            In birou azi cu tine
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-[#1C1917] mb-8 pb-8 border-b border-black/10">
        <div>
          <p className="text-[#57534E] text-[10px] font-bold uppercase tracking-wider mb-1">Email</p>
          <p className="font-semibold">{buddy.email}</p>
        </div>
        <div>
          <p className="text-[#57534E] text-[10px] font-bold uppercase tracking-wider mb-1">Program hibrid</p>
          <p className="font-semibold">{buddyDays.map(mapDayToRo).join(", ")}</p>
        </div>
        <div>
          <p className="text-[#57534E] text-[10px] font-bold uppercase tracking-wider mb-1">Zile suprapuse</p>
          <p className="text-[#1E3F20] font-bold">{overlapText}</p>
        </div>
      </div>

      <div className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#57534E] block mb-3">
          Sugestii Icebreaker
        </span>
        <ul className="space-y-3 text-sm text-[#57534E]">
          {icebreakers.map((ib, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-[#1E3F20] font-bold">•</span>
              <span className="font-medium">{ib}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <div className="relative">
          <button
            onClick={handleSlackClick}
            className="flex items-center justify-center bg-[#1E3F20] hover:bg-[#2C572F] text-white font-semibold py-2.5 px-6 rounded-none text-xs transition-all duration-200 cursor-pointer uppercase tracking-wider"
          >
            Trimite mesaj pe Slack
          </button>
          {slackAlert && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#1C1917] text-white text-[10px] py-1 px-3 rounded-none shadow-md whitespace-nowrap z-10">
              Simulare: Trimitere mesaj pe Slack...
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={handleEmailClick}
            className="flex items-center justify-center bg-white hover:bg-[#FCFAF6] text-[#1C1917] font-semibold py-2.5 px-6 rounded-none text-xs transition-all duration-200 cursor-pointer border border-[#E7E5E4] uppercase tracking-wider"
          >
            Trimite Email
          </button>
          {emailAlert && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#1C1917] text-white text-[10px] py-1 px-3 rounded-none shadow-md whitespace-nowrap z-10">
              Simulare: Trimitere email la {buddy.email}...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
