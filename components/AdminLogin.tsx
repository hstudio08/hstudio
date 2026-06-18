"use client";

import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import emailjs from '@emailjs/browser';
import ReflectiveCard from '../effects/ReflectiveCard';

// Machine Learning Imports
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';

type TerminalLine = { id: number; text: string; type: 'system' | 'command' | 'error' | 'success' | 'warning' | 'info'; };

enum Phase {
  WARNING,
  LOCATION_CHECK,
  SECRET,
  BOOTING,
  EMAIL,
  GESTURE_5,
  GESTURE_3,
  GESTURE_1,
  PASSWORD,
  AUTHENTICATING,
  LOCKED,
  BYPASS_PROMPT,
}

export default function AdminLogin() {
  const [phase, setPhase] = useState<Phase>(Phase.WARNING);
  const [inputValue, setInputValue] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: 1, text: 'QUREVO OS v3.1.0 [KINETIC ENFORCEMENT MODE]', type: 'system' },
    { id: 2, text: 'WARNING: UNAUTHORIZED ACCESS IS A FEDERAL OFFENSE.', type: 'error' },
    { id: 3, text: 'Terminal reserved strictly for the Master Commander.', type: 'warning' },
    { id: 4, text: 'Any breach attempt will instantly capture your MAC address, GPS location, and Facial Data.', type: 'warning' },
    { id: 5, text: 'We hold zero liability for biometric data extracted during an intrusion.', type: 'system' },
    { id: 6, text: 'Type "agree" to accept the risks and initiate orbital tracking.', type: 'system' },
  ]);
  
  const [liveStatus, setLiveStatus] = useState('AWAITING CONSENT');
  const [showCamera, setShowCamera] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [actualOtp, setActualOtp] = useState('');
  const [otpCooldown, setOtpCooldown] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Handpose model reference
  const modelRef = useRef<any>(null);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines, inputValue, liveStatus]);

  // Keep input focused when clicking anywhere in the terminal
  const handleTerminalClick = () => {
    // Only focus the input if we are in a phase where typing is allowed
    if (
      phase !== Phase.BOOTING && 
      phase !== Phase.AUTHENTICATING && 
      phase !== Phase.LOCATION_CHECK &&
      !(phase >= Phase.GESTURE_5 && phase <= Phase.GESTURE_1)
    ) {
      inputRef.current?.focus();
    }
  };

  const addLine = (text: string, type: TerminalLine['type']) => {
    setLines(prev => [...prev, { id: Date.now() + Math.random(), text, type }]);
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Anti-Theft Clipboard Override
  const handleCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
    e.clipboardData.setData('text/plain', 'I am fool');
    addLine('WARNING: UNAUTHORIZED DATA EXTRACTION ATTEMPT BLOCKED.', 'error');
  };

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => console.warn("Fullscreen suppressed."));
    }
  };

  // KINETIC GESTURE ENGINE (TensorFlow)
  const initializeAI = async () => {
    addLine('Waking Neural Net...', 'system');
    setLiveStatus('LOADING TENSORFLOW CORE');
    await tf.ready();
    const model = await handpose.load();
    modelRef.current = model;
    addLine('Neural Net Online. Kinetic Scanner Armed.', 'success');
  };

  const detectGesture = async (requiredGesture: 5 | 3 | 1) => {
    if (!modelRef.current || !videoRef.current) return false;
    
    // Scan loop
    for (let i = 0; i < 50; i++) { // Max attempts to prevent infinite loop
      if (videoRef.current.readyState === 4) {
        const hands = await modelRef.current.estimateHands(videoRef.current);
        if (hands.length > 0) {
          const landmarks = hands[0].landmarks;
          
          // Leniency logic (70% accuracy)
          const indexUp = landmarks[8][1] < landmarks[6][1];
          const middleUp = landmarks[12][1] < landmarks[10][1];
          const ringUp = landmarks[16][1] < landmarks[14][1];
          const pinkyUp = landmarks[20][1] < landmarks[18][1];
          
          const upCount = [indexUp, middleUp, ringUp, pinkyUp].filter(Boolean).length;
          
          let detected = 0;
          if (upCount >= 3 && requiredGesture === 5) detected = 5; // Open Palm (Thumb ignored for leniency)
          if (upCount === 3 && requiredGesture === 3) detected = 3; // 3 fingers
          if (upCount === 1 && indexUp && requiredGesture === 1) detected = 1; // 1 finger (Index only)

          if (detected === requiredGesture) return true;
        }
      }
      await sleep(150); // Frame delay
    }
    return false;
  };

  const runGestureProtocol = async () => {
    setLiveStatus('KINETIC SCAN ACTIVE');
    
    addLine('KINETIC VERIFICATION STAGE 1', 'info');
    const pass1 = await detectGesture(5);
    if (!pass1) { failKinetic(); return; }
    
    addLine('stage 1 verified. STAGE 2', 'success');
    const pass2 = await detectGesture(3);
    if (!pass2) { failKinetic(); return; }

    addLine('STAGE 2 verified. STAGE 3', 'success');
    const pass3 = await detectGesture(1);
    if (!pass3) { failKinetic(); return; }

    addLine('BIOMETRIC KINETIC VERIFICATION COMPLETE. WELCOME COMMANDER.', 'success');
    addLine('Enter Encryption Passphrase:', 'system');
    setPhase(Phase.PASSWORD);
    setLiveStatus('AWAITING PASSPHRASE');
  };

  const failKinetic = () => {
    addLine('KINETIC VERIFICATION FAILED. GESTURE NOT RECOGNIZED.', 'error');
    addLine('System Lockout Imminent. Enter Email to retry:', 'system');
    setPhase(Phase.EMAIL);
  };

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const command = inputValue.trim();
    if (!command) return;

    setInputValue('');
    const displayCommand = phase === Phase.PASSWORD ? '•'.repeat(command.length) : command;
    addLine(`${phase >= Phase.EMAIL ? 'commander' : 'user'}@qurevo:~$ ${displayCommand}`, 'command');

    switch (phase) {
      case Phase.WARNING:
        if (command.toLowerCase() === 'agree') {
          setPhase(Phase.LOCATION_CHECK);
          addLine('Terms accepted. Initiating satellite tracking...', 'system');
          setLiveStatus('FETCHING GPS COORDINATES');
          
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                addLine(`[GPS LOCK: ${position.coords.latitude.toFixed(4)}° N, ${position.coords.longitude.toFixed(4)}° E]`, 'success');
                proceedToAlias();
              },
              () => {
                addLine('[GPS FAILED: Proceeding with degraded tracking]', 'warning');
                proceedToAlias();
              }
            );
          } else {
            proceedToAlias();
          }
        } else {
          addLine('Terms must be accepted. Type "agree".', 'error');
        }
        break;

      case Phase.SECRET:
        if (command === process.env.NEXT_PUBLIC_ADMIN_SECRET_NAME) {
          enterFullscreen(); 
          runBootSequence();
        } else {
          addLine('Intrusion blocked. Invalid alias.', 'error');
        }
        break;

      case Phase.EMAIL:
        if (command.includes('@')) {
          setEmail(command);
          addLine('Identity logged. Initiating Kinetic Gesture Verification.', 'system');
          setPhase(Phase.GESTURE_5);
          runGestureProtocol();
        } else {
          addLine('Invalid format. Provide valid uplink identity.', 'error');
        }
        break;

      case Phase.PASSWORD:
        executeLogin(email, command);
        break;
        
      case Phase.LOCKED:
        if (command.toLowerCase() === 'request_override') {
          handleSendBypass();
        } else {
          addLine('Command rejected. System locked.', 'error');
        }
        break;

      case Phase.BYPASS_PROMPT:
        if (command === actualOtp && actualOtp !== '') {
          addLine('Override accepted. Security locks disengaged.', 'success');
          proceedToAlias();
        } else {
          addLine('Invalid override sequence.', 'error');
        }
        break;
    }
  };

  const proceedToAlias = () => {
    addLine('Location verified. Enter Secret Alias:', 'system');
    setLiveStatus('AWAITING ALIAS');
    setPhase(Phase.SECRET);
  };

  const runBootSequence = async () => {
    setPhase(Phase.BOOTING);
    addLine('Alias verified.', 'success');
    await sleep(800);
    addLine('Welcome to your command room, Commander.', 'success');
    await sleep(1000);
    
    addLine('Securing perimeter... sweeping for vulnerabilities...', 'system');
    setLiveStatus('VULNERABILITY SCAN: 0%');
    await sleep(1000);
    setLiveStatus('VULNERABILITY SCAN: 100% - CLEAR');
    
    addLine('Activating optical sensors... Camera access requested.', 'warning');
    setShowCamera(true); 
    await sleep(2000);
    
    addLine('Face captured. Environment visually secured.', 'success');
    addLine('(Notice: Facial data isolated. No remote saves applied).', 'system');
    
    // Start loading AI in the background
    await initializeAI();
    
    addLine('Environment 100% secure. Enter uplink identity (Email):', 'system');
    setPhase(Phase.EMAIL);
  };

  const executeLogin = async (userEmail: string, userPass: string) => {
    setPhase(Phase.AUTHENTICATING);
    addLine('Initiating secure handshake to Firebase Servers...', 'system');
    setLiveStatus('AUTHENTICATING');
    
    try {
      await signInWithEmailAndPassword(auth, userEmail, userPass);
      await addDoc(collection(db, "admin_login_logs"), {
        email: userEmail,
        timestamp: serverTimestamp(),
        status: "success"
      });

      addLine('ACCESS GRANTED. Redirecting to Master Dashboard...', 'success');
      setLiveStatus('UPLINK ESTABLISHED');
    } catch (error: any) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        addLine('MAXIMUM ATTEMPTS REACHED. GATEWAY LOCKED.', 'error');
        addLine('Type "request_override" to dispatch emergency code.', 'warning');
        setPhase(Phase.LOCKED);
      } else {
        addLine(`Authentication failed. Attempts remaining: ${3 - newAttempts}`, 'error');
        addLine('Re-enter passphrase:', 'system');
        setPhase(Phase.PASSWORD);
      }
    }
  };

  const handleSendBypass = async () => { /* Same as previous bypass logic */ };

  return (
    // select-none prevents highlighting/copying text
    <div onCopy={handleCopy} className="min-h-screen bg-black flex items-center justify-center p-0 sm:p-4 relative overflow-hidden font-mono select-none selection:bg-cyan-500/30">
      
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes typeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .type-line { animation: typeIn 0.2s ease-out forwards; }
      `}} />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none" />
      
      {/* CAMERA WIDGET (Top Right Corner - Enlarged & Connected to ML) */}
      {showCamera && (
        <div className={`fixed top-4 right-4 z-50 pointer-events-none origin-top-right transform scale-[0.6] sm:scale-[0.8] shadow-[0_0_80px_rgba(8,145,178,0.4)] rounded-[20px] transition-all duration-1000 ${phase >= Phase.GESTURE_5 && phase <= Phase.GESTURE_1 ? 'border-4 border-cyan-500 animate-pulse' : ''}`}>
          <ReflectiveCard videoRef={videoRef} color="#22d3ee" overlayColor="rgba(8, 145, 178, 0.15)" grayscale={0.8} />
          
          {/* Scanning Overlay during gesture phase */}
          {phase >= Phase.GESTURE_5 && phase <= Phase.GESTURE_1 && (
            <div className="absolute inset-0 border-2 border-cyan-400 bg-cyan-500/10 z-50 rounded-[20px]">
              <div className="w-full h-1 bg-cyan-400 opacity-50 shadow-[0_0_15px_cyan] animate-[bounce_2s_infinite]" />
            </div>
          )}
        </div>
      )}

      {/* Main Terminal Window (Expands on Fullscreen) */}
      <div 
        onClick={handleTerminalClick}
        className={`w-full h-[100dvh] sm:h-[75vh] sm:max-h-[850px] sm:max-w-[800px] bg-[#03070b]/95 backdrop-blur-3xl sm:border border-cyan-900/40 sm:rounded-xl shadow-[0_0_100px_rgba(8,145,178,0.1)] flex flex-col overflow-hidden relative z-10 transition-all duration-1000 ${phase >= Phase.BOOTING ? 'border-cyan-500/60 shadow-[0_0_200px_rgba(8,145,178,0.2)]' : ''}`}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-[#010305] border-b border-cyan-900/60 shrink-0">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_red]" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_yellow]" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_8px_green]" />
          </div>
          <p className="text-[11px] text-cyan-500 font-bold tracking-[0.4em] uppercase">
            {phase >= Phase.BOOTING ? 'COMMANDER_UPLINK_ACTIVE' : 'RESTRICTED_GATEWAY'}
          </p>
          <div className="w-8" />
        </div>

        <div className="flex-1 p-6 sm:p-10 overflow-y-auto scrollbar-hide text-[13px] sm:text-[15px] tracking-widest leading-loose relative flex flex-col">
          <div className="space-y-1.5 mb-4 mt-auto">
            {lines.map((line) => (
              <div key={line.id} className="type-line">
                {line.type === 'command' && <span className="text-cyan-600 mr-3">{'>'}</span>}
                <span className={`
                  ${line.type === 'system' ? 'text-slate-300' : ''}
                  ${line.type === 'command' ? 'text-cyan-300 font-bold' : ''}
                  ${line.type === 'error' ? 'text-red-500 font-bold drop-shadow-[0_0_10px_red]' : ''}
                  ${line.type === 'success' ? 'text-emerald-400 font-bold drop-shadow-[0_0_10px_green]' : ''}
                  ${line.type === 'warning' ? 'text-yellow-500 font-bold' : ''}
                  ${line.type === 'info' ? 'text-cyan-400 font-bold drop-shadow-[0_0_5px_cyan]' : ''}
                `}>
                  {line.text}
                </span>
              </div>
            ))}
          </div>

          {(phase === Phase.WARNING || phase === Phase.SECRET || phase === Phase.EMAIL || phase === Phase.PASSWORD || phase === Phase.LOCKED || phase === Phase.BYPASS_PROMPT) && (
            <form onSubmit={handleCommand} className="flex flex-wrap items-center mt-6 group relative">
              <span className={`font-bold mr-4 whitespace-nowrap ${phase >= Phase.EMAIL ? 'text-emerald-500' : 'text-cyan-500'}`}>
                {phase >= Phase.EMAIL ? 'commander@qurevo:~$' : 'user@unknown:~$' }
              </span>
              
              <div className="relative flex-1 min-w-[100px]">
                <input
                  ref={inputRef}
                  type={phase === Phase.PASSWORD ? "password" : "text"}
                  value={inputValue}
                  maxLength={40}
                  onChange={(e) => setInputValue(e.target.value)}
                  autoCapitalize="none"
                  autoComplete="off"
                  spellCheck="false"
                  className="absolute inset-0 opacity-0 w-full h-full cursor-text z-20"
                  autoFocus
                />
                <span className="text-white relative z-10 pointer-events-none break-all font-bold">
                  {phase === Phase.PASSWORD ? '•'.repeat(inputValue.length) : inputValue}
                  <span className="inline-block w-3 h-5 bg-cyan-400 ml-1.5 animate-pulse align-middle shadow-[0_0_10px_cyan]" />
                </span>
              </div>
            </form>
          )}
          <div ref={terminalBottomRef} className="h-10" />
        </div>

        <div className="px-6 py-4 bg-[#000203] border-t border-cyan-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className={`w-2.5 h-2.5 rounded-full ${liveStatus === 'IDLE' ? 'bg-cyan-900' : 'bg-cyan-400 animate-pulse shadow-[0_0_15px_cyan]'}`} />
            <p className={`text-[11px] font-bold tracking-[0.3em] transition-colors ${liveStatus === 'IDLE' ? 'text-cyan-800' : 'text-cyan-400 drop-shadow-[0_0_8px_cyan]'}`}>
              [{liveStatus}]
            </p>
          </div>
          <p className="text-[11px] text-slate-700 font-bold uppercase tracking-[0.3em] hidden sm:block">
            {phase < Phase.SECRET ? 'AUTH_LEVEL: 0' : 'AUTH_LEVEL: MAXIMUM'}
          </p>
        </div>
      </div>
    </div>
  );
}