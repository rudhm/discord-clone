import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

// --- LOGIN COMPONENT ---
export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    // Add a 1.2-second delay to simulate authenticating
    setTimeout(() => {
      if (onLogin) onLogin();
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-[#5865F2] flex items-center justify-center p-4 font-sans text-[#dbdee1]">
      <div className="bg-[#313338] rounded-[5px] shadow-2xl w-full max-w-[784px] p-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center mb-6">
            <h2 className="text-[24px] font-semibold text-[#f2f3f5] leading-tight">Welcome back!</h2>
            <p className="text-[#b5bac1] text-[16px] mt-2">We're so excited to see you again!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[12px] font-bold text-[#b5bac1] uppercase tracking-wide mb-2">
                Email or Phone Number <span className="text-[#f23f43]">*</span>
              </label>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1e1f22] border-none rounded p-[10px] text-[#dbdee1] focus:outline-none focus:ring-1 focus:ring-[#00a8fc]" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-[12px] font-bold text-[#b5bac1] uppercase tracking-wide mb-2">
                Password <span className="text-[#f23f43]">*</span>
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1e1f22] border-none rounded p-[10px] text-[#dbdee1] focus:outline-none focus:ring-1 focus:ring-[#00a8fc]" 
                required 
              />
              <a href="#" className="text-[14px] text-[#00a8fc] hover:underline mt-1 inline-block">
                Forgot your password?
              </a>
            </div>

            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] disabled:bg-[#4752C4] disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded transition-colors mt-2 text-[16px] flex justify-center items-center h-11"
            >
              {isLoggingIn ? <Loader2 size={20} className="animate-spin text-white/80" /> : "Log In"}
            </button>
          </form>

          <div className="mt-4">
            <span className="text-[#949ba4] text-[14px]">Need an account? </span>
            <a href="#" className="text-[#00a8fc] text-[14px] hover:underline">Register</a>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center w-[240px] pl-8 border-l border-[#1e1f22]">
          <div className="bg-white p-2 rounded-lg mb-6">
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DiscordLoginSimulator" 
              alt="QR Code" 
              className="w-[150px] h-[150px]" 
            />
          </div>
          <h3 className="text-[24px] font-semibold text-[#f2f3f5] mb-2 text-center leading-tight">
            Log in with QR Code
          </h3>
          <p className="text-[#b5bac1] text-[16px] text-center leading-relaxed">
            Scan this with the <strong>Discord mobile app</strong> to log in instantly.
          </p>
        </div>
      </div>
    </div>
  );
}
