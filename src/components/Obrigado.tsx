import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, User, Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Card, Button } from './UI';
import { supabase } from '../lib/supabase';

interface ObrigadoProps {
  onComplete: (email: string, uid: string) => void;
}

export const Obrigado: React.FC<ObrigadoProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'loading' | 'form' | 'success'>('loading');
  const [token, setToken] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setStep('success');
        setTimeout(() => {
          onComplete(session.user.email || '', session.user.id);
        }, 2000);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const tokenParam = params.get('token');
      const emailParam = params.get('email');
      
      if (tokenParam && emailParam) {
        setToken(tokenParam);
        setEmail(emailParam);
        setStep('form');
      } else {
        setError('Link inválido. Por favor, utilize o link enviado ao seu email.');
      }
    };

    checkAuth();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setIsLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: updateError } = await supabase
          .from('purchase_access')
          .update({ 
            used: true,
            auth_user_id: authData.user.id
          })
          .eq('token', token);

        if (updateError) console.error('Error updating token:', updateError);

        setStep('success');
        setTimeout(() => {
          onComplete(email, authData.user.id);
        }, 2000);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.message?.includes('already registered')) {
        setError('Este email já está cadastrado. Tente fazer login.');
      } else {
        setError(err.message || 'Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-[#FCFBFA] flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-violet-600 mx-auto mb-4" />
          <p className="text-gray-600 font-bold">Carregando...</p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
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
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-100/30 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </motion.div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Obrigada!</h2>
          <p className="text-gray-600 font-bold">Sua compra foi realizada com sucesso!</p>
          <p className="text-sm text-gray-500 mt-2">Enviamos um link de acesso ao seu email. Clique no link para fazer login automaticamente.</p>
        </div>

        <Card className="p-8 border border-gray-100 shadow-2xl bg-white/80 backdrop-blur-xl rounded-[40px]">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-bold flex items-center gap-2 mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Nome</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  value={email}
                  disabled
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 border border-gray-200 rounded-2xl font-bold text-gray-500 cursor-not-allowed"
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
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Confirmar Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita sua senha"
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
                  Criar Minha Conta <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        </Card>

        <p className="text-center text-[10px] text-gray-400 mt-8 font-black uppercase tracking-widest">
          Gravidez Organizada • Versão 1.0.0
        </p>
      </motion.div>
    </div>
  );
};