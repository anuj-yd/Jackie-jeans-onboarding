import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';
import { Mic, ListChecks } from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animated-bg">
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-card max-w-md w-full rounded-3xl p-10 text-center space-y-8 relative overflow-hidden"
      >
        {/* Decorative subtle blob */}
        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-50px] left-[-50px] w-32 h-32 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-4 relative z-10">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 pb-1"
          >
            Jackie Jeans
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-semibold tracking-tight text-gray-800"
          >
            Find Your Perfect Fit
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            Answer a few questions and we'll recommend jeans that fit effortlessly.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-5 pt-4 relative z-10"
        >
          <Button 
            fullWidth 
            size="lg" 
            onClick={() => navigate('/manual')}
            className="group shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <ListChecks className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" />
            Start Quiz Manually
          </Button>

          <Button 
            fullWidth 
            size="lg" 
            variant="outline"
            onClick={() => navigate('/voice')}
            className="group bg-white/50 backdrop-blur-md hover:bg-white/80 border-2 border-gray-300 hover:border-primary transition-all"
          >
            <Mic className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform text-primary" />
            Try Voice Onboarding
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};
