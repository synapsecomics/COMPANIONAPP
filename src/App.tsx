import React, { useState, useCallback, useEffect } from 'react';
import DiceRoller from './components/DiceRoller/DiceRoller';
import CharacterSheet from './components/CharacterManager/CharacterSheet';
import WellnessCenter from './components/WellnessCenter/WellnessCenter';
import ShipStatus from './components/ShipDashboard/ShipStatus';
import PogoEasterEgg from './components/EasterEggs/PogoEasterEgg';

const App = () => {
  const [activeTab, setActiveTab] = useState('roller');
  const [rollHistory, setRollHistory] = useState([]);
  const [concordancePool, setConcordancePool] = useState(6);
  const [hopeTokens, setHopeTokens] = useState(3);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [securityMode, setSecurityMode] = useState(false);
  const [lastInput, setLastInput] = useState('');
  const [showPogo, setShowPogo] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  const [character, setCharacter] = useState({
    name: '',
    track: 'command',
    attributes: {
      reason: 12,
      empathy: 14,
      resolve: 16,
      intuition: 13,
      vigor: 11
    },
    entropy: 0,
    bonds: [],
    specialAbility: ''
  });

  // Breathing animation effect
  useEffect(() => {
    if (!breathingActive) return;
    const interval = setInterval(() => {
      setBreathingPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale');
    }, 4000);
    return () => clearInterval(interval);
  }, [breathingActive]);

  // Security protocol handler
  useEffect(() => {
    if (lastInput === 'S') {
      setSecurityMode(true);
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: Date.now(),
          type: 'system',
          content: 'Ƨ - Secure channel established. Signal confirmed. <8>',
          timestamp: new Date().toLocaleTimeString()
        }]);
      }, 500);
    }
  }, [lastInput]);

  const rollDice = useCallback((sides, count = 1, modifier = 0, label = '') => {
    const rolls = [];
    let total = modifier;
    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      rolls.push(roll);
      total += roll;
    }
    const result = {
      id: Date.now() + Math.random(),
      label: label || `${count}d${sides}${modifier ? `+${modifier}` : ''}`,
      rolls,
      modifier,
      total,
      timestamp: new Date().toLocaleTimeString()
    };
    setRollHistory(prev => [result, ...prev.slice(0, 19)]);
    return result;
  }, []);

  const concordanceRoll = useCallback((attribute, difficulty = 15, usedConcordance = 0) => {
    const d20Roll = rollDice(20, 1, 0, 'Core d20');
    const concordanceDice = usedConcordance > 0 ? rollDice(6, usedConcordance, 0, `${usedConcordance}d6 Concordance`) : null;
    const attributeValue = character.attributes[attribute] || 10;
    const total = d20Roll.total + attributeValue + (concordanceDice ? concordanceDice.total : 0);
    const success = total >= difficulty;
    const result = {
      id: Date.now(),
      label: `${attribute.toUpperCase()} Check (DC ${difficulty})`,
      d20: d20Roll.total,
      attribute: attributeValue,
      concordance: concordanceDice ? concordanceDice.total : 0,
      total,
      success,
      type: 'concordance',
      timestamp: new Date().toLocaleTimeString()
    };
    setRollHistory(prev => [result, ...prev.slice(0, 19)]);
    if (usedConcordance > 0) {
      setConcordancePool(prev => Math.max(0, prev - usedConcordance));
    }
    return result;
  }, [character.attributes, rollDice]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Spark of Rebellion
          </h1>
          <p className="text-gray-400 mt-2">Digital Companion for The Wanderer Universe</p>
        </header>
        <nav className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('roller')}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                activeTab === 'roller' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Dice Roller
            </button>
            <button
              onClick={() => setActiveTab('character')}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                activeTab === 'character' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Character
            </button>
            <button
              onClick={() => setActiveTab('wellness')}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                activeTab === 'wellness' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Wellness
            </button>
            <button
              onClick={() => setActiveTab('ship')}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                activeTab === 'ship' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Ship Status
            </button>
          </div>
        </nav>
        <main>
          {showPogo ? (
            <PogoEasterEgg setShowPogo={setShowPogo} />
          ) : (
            <>
              {activeTab === 'roller' && (
                <DiceRoller
                  character={character}
                  concordancePool={concordancePool}
                  hopeTokens={hopeTokens}
                  rollHistory={rollHistory}
                  rollDice={rollDice}
                  concordanceRoll={concordanceRoll}
                  setConcordancePool={setConcordancePool}
                  setHopeTokens={setHopeTokens}
                />
              )}
              {activeTab === 'character' && (
                <CharacterSheet
                  character={character}
                  setCharacter={setCharacter}
                />
              )}
              {activeTab === 'wellness' && (
                <WellnessCenter
                  breathingActive={breathingActive}
                  setBreathingActive={setBreathingActive}
                  breathingPhase={breathingPhase}
                  character={character}
                  hopeTokens={hopeTokens}
                  setCharacter={setCharacter}
                  setHopeTokens={setHopeTokens}
                  setConcordancePool={setConcordancePool}
                  chatMessages={chatMessages}
                  setChatMessages={setChatMessages}
                  securityMode={securityMode}
                />
              )}
              {activeTab === 'ship' && <ShipStatus />}
            </>
          )}
        </main>
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Inspired by the DiceRoller legacy • Built for collaborative storytelling</p>
          <p className="mt-1">Version 1.0 - "The Wanderer" • Synapse Comics Project</p>
        </footer>
      </div>
    </div>
  );
};

export default App;