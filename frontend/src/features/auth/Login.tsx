import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../app/CurrentUserContext";
import apiClient from "../../shared/lib/apiClient";
import { Card } from "../../shared/components/Card";
import { Spinner } from "../../shared/components/Spinner";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useCurrentUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await apiClient.post("/employees/login", { email, password });
      const { token, employee } = response.data;
      login(token, employee);
      navigate("/");
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Nu s-a putut realiza conexiunea cu serverul. Verifica daca backendul este pornit.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-[#FCFAF6]">
      <Card variant="glass" className="w-full max-w-md p-10 border border-[#E7E5E4] bg-[#F6F3EB] rounded-none">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-[#1E3F20] flex items-center justify-center mx-auto mb-4 rounded-none">
            <span className="font-serif font-black text-xl text-white">M</span>
          </div>
          <h1 className="text-3xl font-bold text-[#1C1917] tracking-tight">
            Meridian Onboarding
          </h1>
          <p className="text-[#57534E] mt-2 text-xs font-medium">
            Autentifica-te pentru a incepe calatoria ta de integrare
          </p>
        </div>

        {error && (
          <div className="bg-[#FCE4D6] border border-[#F8CBAD] text-[#C65911] text-xs p-4 mb-6 rounded-none">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#57534E] mb-2">
              Adresa de Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white border border-[#E7E5E4] rounded-none px-4 py-3 text-sm text-[#1C1917] placeholder-stone-400 focus:outline-none focus:border-[#1E3F20] focus:ring-1 focus:ring-[#1E3F20]/20 transition-all duration-200"
              placeholder="ex: prenume.nume@gmail.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#57534E] mb-2">
              Parola
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white border border-[#E7E5E4] rounded-none px-4 py-3 text-sm text-[#1C1917] placeholder-stone-400 focus:outline-none focus:border-[#1E3F20] focus:ring-1 focus:ring-[#1E3F20]/20 transition-all duration-200"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E3F20] hover:bg-[#2C572F] text-white font-semibold py-3 rounded-none focus:outline-none focus:ring-2 focus:ring-[#1E3F20]/20 disabled:opacity-50 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? <Spinner size="sm" /> : "Conectare"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#E7E5E4] text-center">
          <p className="text-[10px] text-[#57534E]">
            Conturi de test: <code className="text-[#1E3F20] font-bold">alex.vlad@gmail.com</code> / <code className="text-[#1E3F20] font-bold">1234</code>
          </p>
        </div>
      </Card>
    </div>
  );
};
