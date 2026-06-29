import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../context/OnboardingContext';
import { ProgressBar } from '../components/ProgressBar';
import { Button } from '../components/Button';
import { Mic, MicOff, Loader2, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Parsing Logic Helpers ---
const numberMap = {
  'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
  'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
  'eleven': 11, 'twelve': 12, 'thirty': 30, 'forty': 40, 'fifty': 50,
  'sixty': 60
};

const parseWordsToNumber = (text) => {
  let cleaned = text.toLowerCase().trim();
  const match = cleaned.match(/\d+/);
  if (match) return parseInt(match[0]);
  for (const [word, num] of Object.entries(numberMap)) {
    if (cleaned.includes(word)) return num;
  }
  return null;
};

const parseHeight = (text) => {
  const cleaned = text.toLowerCase();
  const ftMatch = cleaned.match(/(\d+)\s*(foot|feet|'|ft)/);
  const inMatch = cleaned.match(/(\d+)\s*(inches|inch|")/);
  
  if (ftMatch) {
    const ft = ftMatch[1];
    let inc = 0;
    if (inMatch) {
      inc = inMatch[1];
    } else {
      const numberWords = Object.keys(numberMap);
      for (const word of numberWords) {
        if (cleaned.split(' ').includes(word) && numberMap[word] < 12) {
          inc = numberMap[word];
          break;
        }
      }
    }
    return `${ft}'${inc}"`;
  }
  return null;
};

const BRANDS = [
  'Levi\'s', 'Wrangler', 'Lee', 'American Eagle', 'Gap', 'Diesel',
  'Calvin Klein', 'Tommy Hilfiger', 'Pepe Jeans', 'Jack & Jones',
  'H&M', 'Zara', 'Uniqlo', 'True Religion', 'Lucky Brand', 'Old Navy',
  'Lee Cooper', 'Flying Machine', 'Roadster', 'Spykar'
];

export const VoiceQuiz = () => {
  const [step, setStep] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [caption, setCaption] = useState('Press start to begin your conversational fitting.');
  
  const { profileData, updateField, updateBrandSize } = useOnboarding();
  const navigate = useNavigate();

  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        if (event.results[0].isFinal) {
          handleFinalAnswer(currentTranscript);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        setIsListening(false);
        if (hasStarted && event.error === 'no-speech') {
          speakQuestion("I didn't hear anything, could you try again?");
        }
      };
    } else {
      setCaption("Your browser does not support the Web Speech API. Please use Chrome.");
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthesisRef.current) synthesisRef.current.cancel();
    };
  }, [step, profileData, hasStarted]);

  // Auto-start the quiz with the first question when the user arrives
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasStarted) {
        setHasStarted(true);
        askQuestionForStep(1);
      }
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);

  // Store utterance in a ref to prevent garbage collection bug in Chrome
  const currentUtteranceRef = useRef(null);

  const speakQuestion = (text, isAcknowledgement = false) => {
    if (!synthesisRef.current) return;
    synthesisRef.current.cancel();
    
    setIsSpeaking(true);
    setCaption(text);
    
    const utterance = new SpeechSynthesisUtterance(text);
    currentUtteranceRef.current = utterance; // Keep a reference
    
    const voices = synthesisRef.current.getVoices();
    const goodVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Female')) || voices[0];
    if (goodVoice) utterance.voice = goodVoice;
    
    utterance.onend = () => {
      setIsSpeaking(false);
      if (!isAcknowledgement) {
        startListening();
      }
    };

    utterance.onerror = (e) => {
      console.error("Speech synthesis error", e);
      setIsSpeaking(false);
    };
    
    synthesisRef.current.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Recognition already started");
      }
    }
  };

  const handleStart = () => {
    setHasStarted(true);
    askQuestionForStep(1);
  };

  const askQuestionForStep = (currentStep) => {
    const q = getQuestionText(currentStep);
    speakQuestion(q);
  };

  const getQuestionText = (currentStep) => {
    switch(currentStep) {
      case 1: return "Hi! I'll help you find your perfect jeans fit. First, what is your height?";
      case 2: return "Got it. What is your weight? You can also say skip.";
      case 3: return "Okay. What is your waist measurement in inches? Usually between 24 and 52.";
      case 4: return "And your hip measurement in inches? Usually between 32 and 60.";
      case 5: return "How do you like jeans to fit at the waist? Snug, slightly relaxed, or relaxed?";
      case 6: return "Where should the waistband sit? High rise, mid rise, or low rise?";
      case 7: return "How should jeans fit through the thighs? Fitted, relaxed, or loose?";
      case 8: return "Which denim brands have you bought before? For example, Levi's, Wrangler, or Zara.";
      case 9: 
        if (profileData.brands.length === 0) return "No brands selected. Skipping size question.";
        return `What size do you wear in these brands?`;
      case 10: return "Finally, what is your biggest fit frustration? For example, waist gap, hip tightness, or wrong length.";
      default: return "";
    }
  };

  const handleFinalAnswer = (text) => {
    setIsListening(false);
    const cleaned = text.toLowerCase();
    
    if (cleaned.includes('skip') || cleaned.includes('no') || cleaned.includes('pass')) {
      if (step === 2) {
        updateField('weight', '');
        moveToNextStep("Skipping weight.");
        return;
      }
    }

    let parsed = null;
    let acknowledgement = "";

    // Dynamic compliment generator
    const getCompliment = (type, value) => {
      const v = (value || '').toString().toLowerCase();
      if (type === 'waistFit') {
        if (v.includes('snug')) return 'A snug waist gives a beautiful tailored look. ';
        if (v.includes('slightly')) return 'Slightly relaxed is the perfect balance of comfort and style. ';
        if (v.includes('relax')) return 'A relaxed waist is perfect for ultimate everyday comfort. ';
      }
      if (type === 'waistband') {
        if (v.includes('high')) return 'High rise is so flattering and trendy right now! ';
        if (v.includes('mid')) return 'Mid rise is such a timeless and classic choice. ';
        if (v.includes('low')) return 'Low rise brings a really cool, vintage vibe! ';
      }
      if (type === 'thighFit') {
        if (v.includes('fitted')) return 'Fitted thighs really highlight your silhouette nicely. ';
        if (v.includes('relax')) return 'Relaxed thighs give you that perfect effortless look. ';
        if (v.includes('loose')) return 'Loose fit is incredibly stylish and comfortable! ';
      }
      if (type === 'frustration') {
        if (v.includes('gap')) return "We completely understand, waist gaps are the worst! ";
        if (v.includes('tight')) return "Hip tightness is so uncomfortable, we've got you covered! ";
        if (v.includes('length')) return "Getting the right length is tricky, but we'll sort it out! ";
        return "Got it. We'll make sure to find a fit that avoids that completely! ";
      }
      
      const words = ['Awesome', 'Perfect', 'Excellent', 'Wonderful', 'Great'];
      return `${words[Math.floor(Math.random() * words.length)]}! `;
    };

    switch (step) {
      case 1:
        parsed = parseHeight(cleaned);
        if (parsed) {
          updateField('height', parsed);
          acknowledgement = `${getCompliment('height', parsed)}Your height is recorded as ${parsed.replace("'", " foot ").replace('"', " inches")}.`;
          moveToNextStep(acknowledgement);
        } else {
          speakQuestion("I didn't quite catch that. Please state your height like, five foot six.");
        }
        break;
      
      case 2:
        const num = parseWordsToNumber(cleaned);
        if (num) {
          updateField('weight', num);
          acknowledgement = `${getCompliment('weight', num)}Your weight is ${num}.`;
          moveToNextStep(acknowledgement);
        } else {
          speakQuestion("Please state your weight as a number, or say skip.");
        }
        break;

      case 3:
        const waist = parseWordsToNumber(cleaned);
        if (waist && waist >= 20 && waist <= 60) {
          updateField('waist', `${waist}"`);
          acknowledgement = `${getCompliment('waist', waist)}Waist ${waist}.`;
          moveToNextStep(acknowledgement);
        } else {
          speakQuestion("Please state a number between 24 and 52.");
        }
        break;

      case 4:
        const hip = parseWordsToNumber(cleaned);
        if (hip && hip >= 20 && hip <= 70) {
          updateField('hip', `${hip}"`);
          acknowledgement = `${getCompliment('hip', hip)}Hip ${hip}.`;
          moveToNextStep(acknowledgement);
        } else {
          speakQuestion("Please state a number between 32 and 60.");
        }
        break;

      case 5:
        if (cleaned.includes('snug')) { parsed = 'Snug'; }
        else if (cleaned.includes('slightly')) { parsed = 'Slightly Relaxed'; }
        else if (cleaned.includes('relax')) { parsed = 'Relaxed'; }
        
        if (parsed) {
          updateField('waistFit', parsed);
          acknowledgement = `${getCompliment('waistFit', parsed)}`;
          moveToNextStep(acknowledgement);
        } else {
          speakQuestion("Say snug, slightly relaxed, or relaxed.");
        }
        break;

      case 6:
        if (cleaned.includes('high')) { parsed = 'High Rise'; }
        else if (cleaned.includes('mid')) { parsed = 'Mid Rise'; }
        else if (cleaned.includes('low')) { parsed = 'Low Rise'; }
        
        if (parsed) {
          updateField('waistband', parsed);
          acknowledgement = `${getCompliment('waistband', parsed)}`;
          moveToNextStep(acknowledgement);
        } else {
          speakQuestion("Say high rise, mid rise, or low rise.");
        }
        break;

      case 7:
        if (cleaned.includes('fit')) { parsed = 'Fitted'; }
        else if (cleaned.includes('relax')) { parsed = 'Relaxed'; }
        else if (cleaned.includes('loose')) { parsed = 'Loose'; }
        
        if (parsed) {
          updateField('thighFit', parsed);
          acknowledgement = `${getCompliment('thighFit', parsed)}`;
          moveToNextStep(acknowledgement);
        } else {
          speakQuestion("Say fitted, relaxed, or loose.");
        }
        break;

      case 8:
        const selected = [];
        BRANDS.forEach(b => {
          if (cleaned.includes(b.toLowerCase())) selected.push(b);
        });
        
        if (selected.length > 0) {
          updateField('brands', selected);
          acknowledgement = `Nice taste in brands! I heard ${selected.join(" and ")}.`;
          moveToNextStep(acknowledgement);
        } else if (cleaned.includes('none') || cleaned.includes('skip')) {
          moveToNextStep("No brands selected.");
        } else {
          speakQuestion("I didn't catch any brands. Please say brands like Levi's or Zara, or say none.");
        }
        break;

      case 9:
        const size = parseWordsToNumber(cleaned);
        if (size) {
          profileData.brands.forEach(b => updateBrandSize(b, size.toString()));
          acknowledgement = `${getCompliment('size', size)}Size ${size} recorded.`;
          moveToNextStep(acknowledgement);
        } else if (cleaned.includes('skip') || cleaned.includes('none')) {
          moveToNextStep("Skipping sizes.");
        } else {
           speakQuestion("Please say a number for your size, or say skip.");
        }
        break;

      case 10:
        if (cleaned.includes('gap')) { parsed = 'Waist gap'; }
        else if (cleaned.includes('tight')) { parsed = 'Hip tightness'; }
        else if (cleaned.includes('length')) { parsed = 'Wrong length'; }
        else if (cleaned.includes('thigh')) { parsed = 'Thigh fit'; }
        else if (cleaned.includes('rise')) { parsed = 'Rise'; }
        else { parsed = 'Other'; } 
        
        updateField('frustration', parsed);
        acknowledgement = `${getCompliment('frustration', parsed)}`;
        moveToNextStep(acknowledgement);
        break;

      default:
        break;
    }
  };

  const moveToNextStep = (acknowledgementText) => {
    synthesisRef.current.cancel();
    setCaption(acknowledgementText);
    
    const u = new SpeechSynthesisUtterance(acknowledgementText);
    currentUtteranceRef.current = u; // Keep a reference
    
    u.onend = () => {
      if (step < 10) {
        setStep(prev => prev + 1);
        askQuestionForStep(step + 1);
      } else {
        speakQuestion("Thank you! Generating your perfect fit recommendations now.", true);
        setTimeout(() => {
          navigate('/completion');
        }, 3000);
      }
    };
    
    u.onerror = (e) => {
      console.error("Speech synthesis error", e);
    };

    synthesisRef.current.speak(u);
  };


  return (
    <div className="min-h-screen animated-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg mb-12 absolute top-8 px-4">
        <ProgressBar currentStep={step} totalSteps={10} />
      </div>

      <motion.div
        animate={{ scale: isSpeaking ? [1, 1.02, 1] : 1 }}
        transition={{ repeat: isSpeaking ? Infinity : 0, duration: 2, ease: "easeInOut" }}
        className="glass-card w-full max-w-lg rounded-3xl p-10 flex flex-col items-center space-y-12"
      >
        <div className="relative">
          <motion.div 
            className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-700 ${isListening ? 'bg-gradient-to-tr from-accent to-blue-400 text-white shadow-[0_0_40px_rgba(59,130,246,0.6)]' : 'bg-gray-100 text-gray-400 shadow-inner'}`}
            animate={isListening ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            {isListening ? (
              <Mic className="w-16 h-16" />
            ) : isSpeaking ? (
              <Volume2 className="w-16 h-16 animate-pulse text-primary" />
            ) : (
              <MicOff className="w-16 h-16" />
            )}
          </motion.div>
          {isListening && (
            <>
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-accent"
                animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-blue-400"
                animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
              />
            </>
          )}
        </div>

        <div className="text-center space-y-4 w-full px-4">
          <motion.h2 
            key={caption}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-semibold text-gray-900 min-h-[5rem] leading-tight"
          >
            {caption}
          </motion.h2>
          <div className="min-h-[3rem] bg-gray-100/50 rounded-xl p-3 flex items-center justify-center border border-gray-200/50">
            <p className="text-lg text-gray-600 font-medium">
              {transcript ? `"${transcript}"` : (isListening ? 'Listening...' : '...')}
            </p>
          </div>
        </div>

        {!hasStarted && (
          <Button onClick={handleStart} size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Start Microphone
          </Button>
        )}
        
        {hasStarted && !isListening && !isSpeaking && (
           <Button variant="outline" onClick={startListening} className="w-full sm:w-auto border-2 border-gray-300 hover:border-primary transition-all">
             Listen Again
           </Button>
        )}
      </motion.div>
    </div>
  );
};
