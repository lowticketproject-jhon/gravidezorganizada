import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Key, Mail, ArrowRight, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Card, Button } from './UI';
import { supabase } from '../lib/supabase';

interface TokenValidationProps {
  onTokenValidated: (email: string) => void;
}

export const TokenValidation: React.FC<TokenValidationProps> = ({ onTokenValidated }) => {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error: fetchError } = await supabase
        .from('purchase_access')
        .select('*')
        .eq('token', token)
        .eq('payment_status', 'paid')
        .eq('used', false)
        .single();

      if (fetchError || !data) {
        setError('Token inválido ou já utilizado. Verifique e tente novamente.');
        setIsLoading(false);
        return;
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setError('Este token expirou. Entre em contato para obter um novo.');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      onTokenValidated(data.email);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao validar o token.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <p className="text-gray-600 font-bold mt-2">Você comprou o app? Insira seu token de acesso para continuar.</p>
        </div>

        <Card className="p-8 border border-gray-100 shadow-2xl bg-white/80 backdrop-blur-xl rounded-[40px]">
          {success ? (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </motion.div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Token Validado!</h3>
              <p className="text-gray-600 font-bold">Agora você pode criar sua conta.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-bold flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Token de Acesso</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Cole seu token aqui"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">E-mail de Compra</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email usado na compra"
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
                    Validar Token <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-600 text-sm font-bold">
              Não comprou ainda? <button className="text-violet-600 font-black">Clique aqui</button>
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
