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
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card variant="glass" className="w-full max-w-md p-8 border border-slate-800/80 bg-slate-900/40">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20 mb-4">
            <span className="font-black text-2xl text-white">M</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Meridian Onboarding
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Autentifica-te pentru a incepe calatoria ta de integrare
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Adresa de Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200"
              placeholder="ex: prenume.nume@gmail.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Parola
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-semibold py-3 rounded-xl hover:from-indigo-550 hover:to-sky-450 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50 transition-all duration-300 shadow-md shadow-indigo-500/10 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? <Spinner size="sm" /> : "Conectare"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/40 text-center">
          <p className="text-xs text-slate-500">
            Conturi de test: <code className="text-indigo-400">alex.vlad@gmail.com</code> / <code className="text-indigo-400">1234</code>
          </p>
        </div>
      </Card>
    </div>
  );
};
