import { useRef, useState } from 'react';

const MIN_DELAY_MS = 30000;
const MAX_DELAY_MS = 40000;

const INITIAL_MESSAGES = [
  { id: 'seed-1', role: 'user', text: 'Can you summarise the key ideas behind spaced repetition?' },
  {
    id: 'seed-2',
    role: 'model',
    text:
      'Spaced repetition schedules reviews at increasing intervals instead of cramming everything ' +
      'at once. Reviewing just before you would otherwise forget strengthens memory the most, ' +
      'intervals grow longer each time you recall something successfully, and a little struggle to ' +
      'recall beats easy, immediate review.',
  },
  { id: 'seed-3', role: 'user', text: 'Could you give me a simple weekly schedule for revising this?' },
  {
    id: 'seed-4',
    role: 'model',
    text:
      'Sure. A simple starting point: review new material the next day, then after three days, ' +
      'then after a week, then after two weeks. Adjust the gaps based on how well you recall each item.',
  },
];

const FAKE_RESPONSES = [
  "Here's a quick way to think about it: break the problem into smaller steps, tackle the part you're most unsure about first, and check your assumptions as you go.",
  'Good question. The short version: start with the simplest version that could work, then add complexity only once you have evidence it is needed.',
  "That depends a bit on your goals, but generally you'll want to prioritise clarity over cleverness, and revisit this once you have more data.",
  'One approach: outline the key sections first, then fill in supporting detail, then edit for length last.',
];

function randomDelay() {
  return Math.floor(MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS));
}

export default function useGeminiSimulator() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [aiGenerating, setAiGenerating] = useState(false);
  const timeoutRef = useRef(null);
  const responseIndexRef = useRef(0);

  function submitPrompt(text) {
    const trimmed = text.trim();
    if (!trimmed || aiGenerating) return;

    setMessages((prev) => [...prev, { id: `msg-${Date.now()}-u`, role: 'user', text: trimmed }]);
    setAiGenerating(true);

    timeoutRef.current = setTimeout(() => {
      const reply = FAKE_RESPONSES[responseIndexRef.current % FAKE_RESPONSES.length];
      responseIndexRef.current += 1;
      setMessages((prev) => [...prev, { id: `msg-${Date.now()}-m`, role: 'model', text: reply }]);
      setAiGenerating(false);
      timeoutRef.current = null;
    }, randomDelay());
  }

  function resetGemini() {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    responseIndexRef.current = 0;
    setMessages(INITIAL_MESSAGES);
    setAiGenerating(false);
  }

  return { messages, aiGenerating, submitPrompt, resetGemini };
}
