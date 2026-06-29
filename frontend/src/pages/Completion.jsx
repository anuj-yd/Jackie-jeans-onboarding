import React, { useEffect, useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { saveProfile } from '../services/api';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export const Completion = () => {
  const { profileData, resetProfile } = useOnboarding();
  const [status, setStatus] = useState('saving');

  useEffect(() => {
    let timeoutId;
    const submitData = async () => {
      try {
        await saveProfile(profileData);
        setStatus('success');
        resetProfile();
        
        timeoutId = setTimeout(() => {
          // Pass the fit preferences as URL query parameters to the main site
          const params = new URLSearchParams();
          if (profileData.waistFit) params.append('waistFit', profileData.waistFit);
          if (profileData.waistband) params.append('waistband', profileData.waistband);
          if (profileData.thighFit) params.append('thighFit', profileData.thighFit);
          if (profileData.waist) params.append('waist', profileData.waist);
          
          const queryString = params.toString();
          window.location.href = `https://jackie-jeans.vercel.app/${queryString ? '?' + queryString : ''}`;
        }, 6000);
      } catch (error) {
        console.error('Error saving profile:', error);
        setStatus('error');
      }
    };

    submitData();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="glass-card max-w-sm w-full p-10 rounded-3xl text-center space-y-6"
      >
        {status === 'saving' && (
          <div className="flex flex-col items-center space-y-6">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900">Saving your profile...</h2>
          </div>
        )}

        {status === 'success' && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="flex flex-col items-center space-y-5"
          >
            <CheckCircle2 className="w-20 h-20 text-green-500 drop-shadow-md" />
            <h2 className="text-3xl font-bold text-gray-900">Thanks!</h2>
            
            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 w-full mt-4">
              <h3 className="font-semibold text-primary mb-2">Your Recommendation</h3>
              <p className="text-gray-700 text-sm">
                {profileData.waistband && profileData.thighFit 
                  ? `Based on your profile, we highly recommend the ${profileData.waistband} ${profileData.thighFit} Denim to match your ${profileData.waistFit?.toLowerCase() || 'preferred'} waist preference!`
                  : "We're matching your profile to our best fitting jeans."}
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 flex items-center justify-center space-x-2"
            >
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              <p className="text-sm text-gray-500 font-medium">Redirecting to Jackie Jeans...</p>
            </motion.div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div 
            initial={{ x: [-10, 10, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center space-y-5"
          >
            <AlertCircle className="w-20 h-20 text-red-500 drop-shadow-md" />
            <h2 className="text-3xl font-bold text-gray-900">Oops!</h2>
            <p className="text-lg text-gray-600">Something went wrong saving your profile.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="mt-6 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-colors"
            >
              Go Home
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
