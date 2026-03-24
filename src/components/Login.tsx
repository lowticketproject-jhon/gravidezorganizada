import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Baby, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card, Button } from './UI';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onLogin: (email: string, rememberMe: boolean, userId?: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(false);
    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        if (data.user) {
          onLogin(email, rememberMe, data.user.id);
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        if (data.user) {
          onLogin(email, rememberMe, data.user.id);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao processar sua solicitação.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBFA] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-100/30 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <img 
            src="https://res.cloudinary.com/dynjqdxw8/image/upload/v1774313731/ChatGPT_Image_23_de_mar._de_2026_21_53_55_1_kc0uqi.png" 
            alt="Gravidez Organizada" 
            className="w-40 h-40 mx-auto mb-2 object-contain"
          />
          <p className="text-gray-600 font-bold mt-2">Acompanhe sua gravidez com clareza, organização e próximos passos em cada fase.</p>
        </div>

        <Card className="p-8 border border-gray-100 shadow-2xl bg-white/80 backdrop-blur-xl rounded-[40px]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-violet-50 border border-violet-100 rounded-2xl text-violet-700 text-sm font-bold">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${rememberMe ? 'bg-violet-500 border-violet-500' : 'bg-white border-gray-300 group-hover:border-violet-300'}`}>
                    {rememberMe && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                </div>
                <span className="text-sm font-black text-gray-700">Manter conectado</span>
              </label>
              {!isSignUp && (
                <button type="button" className="text-sm font-black text-violet-600 hover:text-violet-700">Esqueceu?</button>
              )}
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              gender="unknown"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-violet-600 text-white font-black shadow-lg shadow-violet-100 flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? 'Criar Conta' : 'Entrar'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-600 text-sm font-bold">
              {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'} <button onClick={() => setIsSignUp(!isSignUp)} className="text-violet-600 font-black">{isSignUp ? 'Entrar' : 'Cadastre-se'}</button>
            </p>
          </div>
        </Card>

        <p className="text-center text-[10px] text-gray-400 mt-8 font-black uppercase tracking-widest">
          Gravidez Organizada • Versão 1.0.0
        </p>
      </motion.div>
    </div>
  );
};
