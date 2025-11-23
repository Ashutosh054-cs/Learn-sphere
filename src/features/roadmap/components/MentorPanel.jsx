import { useState, useRef, useEffect } from 'react';
import { Send, Brain, X, MessageCircle, BookOpen, FileQuestion, Lightbulb } from 'lucide-react';
import FrostedCard from '../../../components/ui/FrostedCard';
import useRoadmapStore from '../../../stores/roadmapStore';

export default function MentorPanel() {
  const { chatMessages, addChatMessage, toggleMentorPanel, isMentorPanelOpen } = useRoadmapStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    addChatMessage({ role: 'user', content: input });

    // Simulate AI response (canned)
    setTimeout(() => {
      const responses = [
        "That's a great question! Based on your current progress, I'd recommend focusing on CSS fundamentals next.",
        "I can help with that! Let me break it down into smaller steps for you.",
        "Excellent progress! You're on track to complete your weekly goals.",
        "I noticed you're working on JavaScript. Would you like some practice exercises?",
        "Great job completing that module! Ready to tackle the next challenge?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addChatMessage({ role: 'ai', content: randomResponse });
    }, 1000);

    setInput('');
  };

  const quickActions = [
    { id: 'explain', label: 'Explain Topic', icon: MessageCircle, action: 'explain' },
    { id: 'tutorials', label: 'Tutorials', icon: BookOpen, action: 'tutorials' },
    { id: 'quiz', label: 'Create Quiz', icon: FileQuestion, action: 'quiz' },
    { id: 'project', label: 'Mini Project', icon: Lightbulb, action: 'project' }
  ];

  const handleQuickAction = (action) => {
    const actionResponses = {
      explain: "I'll explain the current topic in detail. Which concept would you like me to clarify?",
      tutorials: "Here are the top tutorials for your current skill level: [Tutorial links would appear here]",
      quiz: "I've prepared a quiz for you! It will help reinforce what you've learned.",
      project: "How about building a personal portfolio website? It's a great way to practice HTML, CSS, and JavaScript!"
    };

    addChatMessage({ role: 'ai', content: actionResponses[action] });
  };

  return (
    <FrostedCard className="p-0 overflow-hidden flex flex-col" style={{ height: '600px' }}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6" style={{ color: 'var(--accent-secondary)' }} />
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            AI Mentor
          </h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: 'rgba(74, 222, 128, 0.1)',
              color: '#4ADE80'
            }}
          >
            Online
          </span>
        </div>
        <button
          onClick={toggleMentorPanel}
          className="p-1 rounded-full hover:bg-white/10 transition-colors lg:hidden"
        >
          <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b grid grid-cols-2 gap-2" style={{ borderColor: 'var(--border-color)' }}>
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleQuickAction(action.action)}
            className="p-2 rounded-lg text-xs font-medium transition-all hover:scale-105 flex items-center justify-center gap-1"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)'
            }}
          >
            <action.icon className="w-3 h-3" />
            {action.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-[80%] p-3 rounded-lg text-sm"
              style={{
                backgroundColor: message.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: message.role === 'user' ? 'var(--bg-primary)' : 'var(--text-primary)'
              }}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your AI mentor..."
            className="flex-1 px-3 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)'
            }}
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 rounded-lg transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--bg-primary)'
            }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </FrostedCard>
  );
}
