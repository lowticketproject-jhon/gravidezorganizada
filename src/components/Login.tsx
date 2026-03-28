import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Baby, Mail, Lock, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, Button } from './UI';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onLogin: (email: string, rememberMe: boolean, userId?: string) => void;
  onRequestTokenValidation?: () => void;
}

interface SignUpResponse {
  user: { id: string; email: string } | null;
  session: unknown;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onRequestTokenValidation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(true);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [isRecoverPassword, setIsRecoverPassword] = useState(false);
  const [recoverEmailSent, setRecoverEmailSent] = useState(false);

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
        
        if (signUpError) {
          if (signUpError.message.includes('already registered') || signUpError.message.includes('already been registered')) {
            setError('Este e-mail já está cadastrado. Clique em "Já tem uma conta? Entrar" para fazer login.');
            setIsLoading(false);
            return;
          }
          throw signUpError;
        }
        
        if (data.user) {
          setSignUpSuccess(true);
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

  const handleRecoverPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;
      setRecoverEmailSent(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar e-mail de recuperação.');
    } finally {
      setIsLoading(false);
    }
};

  if (recoverEmailSent) {
    return (
      <div className="min-h-screen bg-[#FCFBFA] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-100/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[100px]" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="p-8 border border-gray-100 shadow-2xl bg-white/80 backdrop-blur-xl rounded-[40px] text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </motion.div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">E-mail Enviado!</h3>
            <p className="text-gray-600 font-bold mb-4">Enviamos um link de recuperação para {email}</p>
            <button 
              onClick={() => {
                setRecoverEmailSent(false);
                setIsRecoverPassword(false);
              }}
              className="text-violet-600 font-black text-sm"
            >
              Voltar ao login
            </button>
          </Card>

          <p className="text-center text-[10px] text-gray-400 mt-8 font-black uppercase tracking-widest">
            Gravidez Organizada • Versão 1.0.0
          </p>
        </motion.div>
      </div>
    );
  }

  if (isRecoverPassword) {
    return (
      <div className="min-h-screen bg-[#FCFBFA] flex items-center justify-center p-4 relative overflow-hidden">
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
            <p className="text-gray-600 font-bold mt-2">Digite seu e-mail para receber o link de recuperação de senha.</p>
          </div>

          <Card className="p-8 border border-gray-100 shadow-2xl bg-white/80 backdrop-blur-xl rounded-[40px]">
            {error && (
              <div className="p-4 bg-violet-50 border border-violet-100 rounded-2xl text-violet-700 text-sm font-bold mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleRecoverPassword} className="space-y-6">
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

              <Button 
                type="submit"
                disabled={isLoading}
                gender="unknown"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-violet-600 text-white font-black shadow-lg shadow-violet-100 flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Enviar Link de Recuperação <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
              <button 
                onClick={() => setIsRecoverPassword(false)} 
                className="text-gray-600 text-sm font-bold"
              >
                ← Voltar ao login
              </button>
            </div>
          </Card>

          <p className="text-center text-[10px] text-gray-400 mt-8 font-black uppercase tracking-widest">
            Gravidez Organizada • Versão 1.0.0
          </p>
        </motion.div>
      </div>
    );
  }



  if (signUpSuccess) {
    return (
      <div className="min-h-screen bg-[#FCFBFA] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-100/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[100px]" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="p-8 border border-gray-100 shadow-2xl bg-white/80 backdrop-blur-xl rounded-[40px] text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </motion.div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Conta Criada!</h3>
            <p className="text-gray-600 font-bold mb-4">Bem-vinda ao Gravidez Organizada!</p>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </Card>

          <p className="text-center text-[10px] text-gray-400 mt-8 font-black uppercase tracking-widest">
            Gravidez Organizada • Versão 1.0.0
          </p>
        </motion.div>
      </div>
    );
  }

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
          <p className="text-gray-600 font-bold mt-2">
            {isSignUp 
              ? 'Crie sua conta para começar a acompanhar sua gravidez com clareza e organização.' 
              : 'Acompanhe sua gravidez com clareza, organização e próximos passos em cada fase.'}
          </p>
        </div>

        <Card className="p-8 border border-gray-100 shadow-2xl bg-white/80 backdrop-blur-xl rounded-[40px]">
          {isSignUp && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
              <p className="text-amber-800 text-sm font-bold">
                ⚠️ <strong>Importante:</strong> O cadastro é <span className="underline">único por pessoa</span>. Use o mesmo e-mail utilizado na compra do app para validar seu acesso.
              </p>
            </div>
          )}
          
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
                <button 
                  type="button" 
                  onClick={() => setIsRecoverPassword(true)}
                  className="text-sm font-black text-violet-600 hover:text-violet-700"
                >
                  Esqueceu a senha?
                </button>
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
                  {isSignUp ? 'Criar Minha Conta' : 'Entrar'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center space-y-3">
            <p className="text-gray-600 text-sm font-bold">
              {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'} <button onClick={() => setIsSignUp(!isSignUp)} className="text-violet-600 font-black">{isSignUp ? 'Entrar' : 'Cadastre-se'}</button>
            </p>
            {onRequestTokenValidation && (
              <p className="text-gray-500 text-xs font-bold">
                Comprou o app? <button onClick={onRequestTokenValidation} className="text-violet-600 font-black underline">Validar token de acesso</button>
              </p>
            )}
          </div>
        </Card>

        <p className="text-center text-[10px] text-gray-400 mt-8 font-black uppercase tracking-widest">
          Gravidez Organizada • Versão 1.0.0
        </p>
      </motion.div>
    </div>
  );
};
