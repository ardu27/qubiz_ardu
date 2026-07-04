import { useEffect, useState } from "react";
import { getResources, getSlackChannels } from "./api";
import type { Resource, SlackChannel } from "../../shared/types";
import { Spinner } from "../../shared/components/Spinner";

interface MockMessage {
  sender: string;
  time: string;
  text: string;
}

export const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [slackChannels, setSlackChannels] = useState<SlackChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Slack simulation state
  const [joinedChannelIds, setJoinedChannelIds] = useState<number[]>([]);
  const [activeChannel, setActiveChannel] = useState<SlackChannel | null>(null);
  const [mockMessages, setMockMessages] = useState<MockMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState("");

  useEffect(() => {
    let active = true;
    const loadResourcesData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resData, slackData] = await Promise.all([
          getResources(),
          getSlackChannels()
        ]);
        if (active) {
          setResources(resData);
          setSlackChannels(slackData);
        }
      } catch (err) {
        if (active) {
          setError("Nu s-au putut incarca resursele si canalele de Slack. Asigura-te ca serviciul Onboarding este pornit.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadResourcesData();
    return () => {
      active = false;
    };
  }, []);

  const handleJoinChannel = (channel: SlackChannel) => {
    const isJoined = joinedChannelIds.includes(channel.id);
    if (!isJoined) {
      setJoinedChannelIds(prev => [...prev, channel.id]);
      setActiveChannel(channel);
      // Initialize with welcome messages
      setMockMessages([
        {
          sender: "Andrei Popescu (HR)",
          time: "10:15",
          text: `Salutare si bun venit in canalul ${channel.name}! Ne bucuram mult sa te avem printre noi.`
        },
        {
          sender: "Ioana Vlad (Design)",
          time: "10:18",
          text: "Bun venit! Daca ai intrebari sau doresti sa facem o discutie de prezentare saptamana asta, anunta-ma!"
        }
      ]);
    } else {
      // Toggle active view if already joined
      if (activeChannel?.id === channel.id) {
        setActiveChannel(null);
      } else {
        setActiveChannel(channel);
        setMockMessages([
          {
            sender: "Andrei Popescu (HR)",
            time: "10:15",
            text: `Salutare si bun venit in canalul ${channel.name}! Ne bucuram mult sa te avem printre noi.`
          },
          {
            sender: "Ioana Vlad (Design)",
            time: "10:18",
            text: "Bun venit! Daca ai intrebari sau doresti sa facem o discutie de prezentare saptamana asta, anunta-ma!"
          }
        ]);
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeChannel) return;

    const timeString = new Date().toLocaleTimeString("ro-RO", {
      hour: "2-digit",
      minute: "2-digit"
    });

    setMockMessages(prev => [
      ...prev,
      {
        sender: "Tu (Nou Angajat)",
        time: timeString,
        text: newMessageText
      }
    ]);
    setNewMessageText("");

    // Simulate automated friendly bot reply
    setTimeout(() => {
      setMockMessages(prev => [
        ...prev,
        {
          sender: "Meridian Bot",
          time: new Date().toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }),
          text: `Multumim pentru mesaj! Un coleg va raspunde in curand.`
        }
      ]);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-[#FCFAF6]">
        <Spinner size="lg" />
        <p className="text-[#57534E] mt-4 text-sm font-semibold">Se incarca resursele de onboarding...</p>
      </div>
    );
  }

  if (error) {
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

  // Group resources by category
  const categoriesMap: { [key: string]: Resource[] } = {};
  resources.forEach(res => {
    const cat = res.category || "Altele";
    if (!categoriesMap[cat]) {
      categoriesMap[cat] = [];
    }
    categoriesMap[cat].push(res);
  });

  const mapCategoryName = (cat: string) => {
    const names: { [key: string]: string } = {
      General: "Ghiduri Generale",
      IT: "Configurari IT si Unelte",
      HR: "Resurse Umane si Beneficii"
    };
    return names[cat] || cat;
  };

  return (
    <div className="space-y-16 bg-[#FCFAF6]">
      {/* Header section - Editorial Title */}
      <div className="border-b border-black/10 pb-8">
        <h1 className="text-4xl font-extrabold text-[#1C1917] tracking-tight">
          Wiki Resurse si Canale de Comunicare
        </h1>
        <p className="text-[#57534E] mt-2 text-sm max-w-lg font-medium">
          Exploreaza documentatia de onboarding si simuleaza aderarea la canalele Slack recomandate pentru prima saptamana.
        </p>
      </div>

      {/* Two Column Layout: Left (Wiki Resources), Right (Slack Channel Hub) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Column: Wiki Resources */}
        <div className="space-y-12">
          {Object.keys(categoriesMap).map(cat => (
            <div key={cat} className="space-y-6">
              <h3 className="text-lg font-serif font-black text-[#1C1917] border-b border-black/10 pb-2">
                {mapCategoryName(cat)}
              </h3>
              
              <div className="space-y-6">
                {categoriesMap[cat].map(res => (
                  <div key={res.id} className="space-y-1">
                    <h4 className="text-sm font-bold text-[#1C1917]">
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline hover:text-[#1E3F20] transition-colors"
                      >
                        {res.title}
                      </a>
                    </h4>
                    <p className="text-xs text-[#57534E] leading-relaxed">
                      {res.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Slack Channel Hub */}
        <div className="space-y-12">
          <div className="space-y-6">
            <h3 className="text-lg font-serif font-black text-[#1C1917] border-b border-black/10 pb-2">
              Canale Slack Recomandate
            </h3>

            <div className="divide-y divide-black/10">
              {slackChannels.map(channel => {
                const isJoined = joinedChannelIds.includes(channel.id);
                return (
                  <div key={channel.id} className="flex items-center justify-between py-5 first:pt-0 last:pb-0">
                    <div className="space-y-1 max-w-[70%]">
                      <h4 className="text-sm font-bold text-[#1C1917]">
                        #{channel.name}
                        {channel.isRequired && (
                          <span className="text-[8px] font-bold uppercase tracking-widest bg-stone-200 text-stone-700 ml-2 px-1 py-0.5 border border-stone-300">
                            Obligatoriu
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-[#57534E] truncate">
                        {channel.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleJoinChannel(channel)}
                      className={`text-[10px] font-bold uppercase tracking-wider py-2 px-4 rounded-none border transition-all duration-200 cursor-pointer ${
                        isJoined
                          ? "bg-white hover:bg-[#FCFAF6] text-[#1C1917] border-[#E7E5E4]"
                          : "bg-[#1E3F20] hover:bg-[#2C572F] text-white border-transparent"
                      }`}
                    >
                      {isJoined ? "Vizualizeaza" : "Alatura-te"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simulated Slack Chat Window (Plain Typographic Layout) */}
          {activeChannel && (
            <div className="border border-black/20 bg-white p-8 rounded-none space-y-6">
              <div className="border-b border-black/10 pb-3 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1C1917]">
                  Canal: #{activeChannel.name}
                </span>
                <span className="text-[9px] uppercase font-bold text-[#57534E]/60">
                  Simulare Activa
                </span>
              </div>

              {/* Message History */}
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {mockMessages.map((msg, index) => (
                  <div key={index} className="text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1C1917]">{msg.sender}</span>
                      <span className="text-[9px] text-[#57534E]/60">{msg.time}</span>
                    </div>
                    <p className="text-[#57534E] leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleSendMessage} className="border-t border-black/10 pt-4 flex gap-4">
                <input
                  type="text"
                  value={newMessageText}
                  onChange={e => setNewMessageText(e.target.value)}
                  placeholder={`Scrie un mesaj in #${activeChannel.name}...`}
                  className="flex-1 bg-[#FCFAF6] border border-black/20 rounded-none px-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-black transition-all duration-200"
                />
                <button
                  type="submit"
                  className="bg-[#1C1917] hover:bg-black text-white font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded-none transition-all duration-200 cursor-pointer"
                >
                  Trimite
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
