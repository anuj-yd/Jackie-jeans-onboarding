import React, { createContext, useContext, useState, useEffect } from 'react';

const OnboardingContext = createContext();

const initialState = {
  height: '',
  weight: '',
  waist: '',
  hip: '',
  waistFit: '',
  waistband: '',
  thighFit: '',
  brands: [],
  brandSizes: [],
  frustration: '',
};

export const OnboardingProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(() => {
    // Attempt to load from localStorage
    const saved = localStorage.getItem('jackie-jeans-onboarding');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialState;
      }
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem('jackie-jeans-onboarding', JSON.stringify(profileData));
  }, [profileData]);

  const updateField = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const updateBrandSize = (brand, size) => {
    setProfileData((prev) => {
      const existing = prev.brandSizes.find((bs) => bs.brand === brand);
      if (existing) {
        return {
          ...prev,
          brandSizes: prev.brandSizes.map((bs) =>
            bs.brand === brand ? { ...bs, size } : bs
          ),
        };
      }
      return {
        ...prev,
        brandSizes: [...prev.brandSizes, { brand, size }],
      };
    });
  };

  const resetProfile = () => {
    setProfileData(initialState);
    localStorage.removeItem('jackie-jeans-onboarding');
  };

  return (
    <OnboardingContext.Provider
      value={{ profileData, updateField, updateBrandSize, resetProfile }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);
