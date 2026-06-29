import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../context/OnboardingContext';
import { ProgressBar } from '../components/ProgressBar';
import { Button } from '../components/Button';
import { RadioGroup } from '../components/RadioGroup';
import { MultiSelect } from '../components/MultiSelect';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const BRANDS = [
  'Levi\'s', 'Wrangler', 'Lee', 'American Eagle', 'Gap', 'Diesel',
  'Calvin Klein', 'Tommy Hilfiger', 'Pepe Jeans', 'Jack & Jones',
  'H&M', 'Zara', 'Uniqlo', 'True Religion', 'Lucky Brand', 'Old Navy',
  'Lee Cooper', 'Flying Machine', 'Roadster', 'Spykar'
].map(b => ({ label: b, value: b }));

const HEIGHTS = Array.from({ length: 15 }, (_, i) => {
  const inches = 58 + i; 
  const ft = Math.floor(inches / 12);
  const inc = inches % 12;
  return { label: `${ft}'${inc}"`, value: `${ft}'${inc}"` };
});

const WAISTS = Array.from({ length: 29 }, (_, i) => ({ label: `${24 + i}"`, value: `${24 + i}"` }));
const HIPS = Array.from({ length: 29 }, (_, i) => ({ label: `${32 + i}"`, value: `${32 + i}"` }));

export const ManualQuiz = () => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const { profileData, updateField, updateBrandSize } = useOnboarding();
  const navigate = useNavigate();

  // Scroll to top on step change for mobile friendliness
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleNext = () => {
    setDirection(1);
    if (step < 10) setStep(step + 1);
    else navigate('/completion');
  };

  const handleBack = () => {
    setDirection(-1);
    if (step > 1) setStep(step - 1);
    else navigate('/');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !isNextDisabled()) {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, profileData]);

  const renderQuestion = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">What is your height?</h2>
            <select
              value={profileData.height}
              onChange={(e) => updateField('height', e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-gray-200 bg-white text-lg focus:border-primary focus:ring-0 transition-all hover:border-gray-300 cursor-pointer shadow-sm"
            >
              <option value="">Select height</option>
              {HEIGHTS.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
            </select>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">What is your weight? <span className="text-gray-400 text-xl font-normal block mt-1">(Optional)</span></h2>
            <input
              type="number"
              placeholder="e.g. 150 lbs"
              value={profileData.weight}
              onChange={(e) => updateField('weight', e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-gray-200 bg-white text-lg focus:border-primary focus:ring-0 transition-all hover:border-gray-300 shadow-sm"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Waist measurement</h2>
            <p className="text-gray-500 text-base">Measure at the narrowest point.</p>
            <select
              value={profileData.waist}
              onChange={(e) => updateField('waist', e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-gray-200 bg-white text-lg focus:border-primary focus:ring-0 transition-all hover:border-gray-300 cursor-pointer shadow-sm"
            >
              <option value="">Select waist</option>
              {WAISTS.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
            </select>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Hip measurement</h2>
            <p className="text-gray-500 text-base">Measure at the fullest point.</p>
            <select
              value={profileData.hip}
              onChange={(e) => updateField('hip', e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-gray-200 bg-white text-lg focus:border-primary focus:ring-0 transition-all hover:border-gray-300 cursor-pointer shadow-sm"
            >
              <option value="">Select hip</option>
              {HIPS.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
            </select>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">How do you like jeans to fit at the waist?</h2>
            <RadioGroup
              options={[
                { label: 'Snug', value: 'Snug' },
                { label: 'Slightly Relaxed', value: 'Slightly Relaxed' },
                { label: 'Relaxed', value: 'Relaxed' },
              ]}
              value={profileData.waistFit}
              onChange={(v) => updateField('waistFit', v)}
            />
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Where should the waistband sit?</h2>
            <RadioGroup
              options={[
                { label: 'High Rise', value: 'High Rise' },
                { label: 'Mid Rise', value: 'Mid Rise' },
                { label: 'Low Rise', value: 'Low Rise' },
              ]}
              value={profileData.waistband}
              onChange={(v) => updateField('waistband', v)}
            />
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">How should jeans fit through the thighs?</h2>
            <RadioGroup
              options={[
                { label: 'Fitted', value: 'Fitted' },
                { label: 'Relaxed', value: 'Relaxed' },
                { label: 'Loose', value: 'Loose' },
              ]}
              value={profileData.thighFit}
              onChange={(v) => updateField('thighFit', v)}
            />
          </div>
        );
      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Which denim brands have you bought before?</h2>
            <MultiSelect
              options={BRANDS}
              selectedValues={profileData.brands}
              onChange={(v) => updateField('brands', v)}
            />
          </div>
        );
      case 9:
        if (profileData.brands.length === 0) {
          return (
            <div className="space-y-6 text-center py-12">
              <h2 className="text-3xl font-bold text-gray-900">No brands selected</h2>
              <p className="text-gray-500 text-lg">You can skip this step.</p>
            </div>
          );
        }
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">What size did you buy in those brands?</h2>
            <div className="space-y-5">
              {profileData.brands.map(brand => {
                const sizeObj = profileData.brandSizes.find(b => b.brand === brand);
                return (
                  <div key={brand} className="flex flex-col space-y-2">
                    <label className="font-semibold text-gray-700 text-lg">{brand}</label>
                    <input
                      type="text"
                      placeholder="e.g. 32"
                      value={sizeObj ? sizeObj.size : ''}
                      onChange={(e) => updateBrandSize(brand, e.target.value)}
                      className="w-full p-4 rounded-xl border-2 border-gray-200 bg-white text-lg focus:border-primary focus:ring-0 transition-colors shadow-sm"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 10:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Biggest fit frustration?</h2>
            <RadioGroup
              options={[
                { label: 'Waist gap', value: 'Waist gap' },
                { label: 'Hip tightness', value: 'Hip tightness' },
                { label: 'Wrong length', value: 'Wrong length' },
                { label: 'Thigh fit', value: 'Thigh fit' },
                { label: 'Rise', value: 'Rise' },
                { label: 'Other', value: 'Other' },
              ]}
              value={profileData.frustration}
              onChange={(v) => updateField('frustration', v)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    switch (step) {
      case 1: return !profileData.height;
      case 2: return false; // Optional
      case 3: return !profileData.waist;
      case 4: return !profileData.hip;
      case 5: return !profileData.waistFit;
      case 6: return !profileData.waistband;
      case 7: return !profileData.thighFit;
      case 8: return false; // Can have 0 brands
      case 9: return profileData.brands.some(b => !profileData.brandSizes.find(s => s.brand === b)?.size) && profileData.brands.length > 0;
      case 10: return !profileData.frustration;
      default: return true;
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.98,
    })
  };

  return (
    <div className="min-h-screen animated-bg flex flex-col items-center pt-8 px-4 pb-32">
      <div className="w-full max-w-lg mb-8 px-2">
        <ProgressBar currentStep={step} totalSteps={10} />
      </div>

      <div className="w-full max-w-lg flex-1 relative perspective-1000">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full glass-card rounded-3xl p-8 md:p-10"
          >
            {renderQuestion()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/70 backdrop-blur-xl border-t border-white/40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto flex justify-between items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="px-5 py-4 hover:bg-gray-200/50 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <Button
            onClick={handleNext}
            disabled={isNextDisabled()}
            className="flex-1 max-w-[220px] py-4 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            {step === 10 ? 'Complete Profile' : 'Continue'}
            {step !== 10 && <ArrowRight className="w-5 h-5 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
