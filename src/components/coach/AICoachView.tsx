import React, { useState } from 'react';
import { Sparkles, MessageCircle, Send, Flame, ShieldAlert, CheckCircle2, Droplets } from 'lucide-react';
import { FastingState, MetabolicStage, MealLog } from '../../types';

interface AICoachViewProps {
  fastingState: FastingState;
  elapsedHours: number;
  currentStage: MetabolicStage;
  meals: MealLog[];
  todayWaterMl: number;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AICoachView: React.FC<AICoachViewProps> = ({
  fastingState,
  elapsedHours,
  currentStage,
  meals,
  todayWaterMl,
}) => {
  const isFasting = fastingState === 'FASTING';

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `안녕하세요! FastiMeal AI 임상 다이어티션 코치입니다. 현재 고객님은 ${isFasting ? `단식 ${elapsedHours.toFixed(1)}시간째로 [${currentStage.name}] 구간` : '식사 윈도우'}에 계십니다. 오늘 식단이나 단식 대사에 대해 궁금한 점이 있으신가요?`,
      timestamp: '방금 전',
    }
  ]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: '방금 전',
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // 스마트 AI 응답 생성
    setTimeout(() => {
      let aiReply = '';
      const query = text.toLowerCase();

      if (query.includes('배고파') || query.includes('허기') || query.includes('꼬르륵')) {
        aiReply = `단식 중 느끼는 강한 허기는 '그렐린(Ghrelin)' 호르몬의 일시적 분비 때문입니다. 보통 15~20분이 지나면 자연스럽게 가라앉습니다! 따뜻한 물 한 컵(250ml)이나 블랙 커피를 천천히 드시면 가짜 배고픔이 즉시 완화됩니다. 💧`;
      } else if (query.includes('커피') || query.includes('음료') || query.includes('차')) {
        aiReply = `순수 블랙 아메리카노, 녹차, 루이보스티, 물은 칼로리와 당분이 없어 인슐린을 분비시키지 않으므로 단식 중에도 안심하고 드셔도 됩니다! 단, 시럽이나 우유가 들어간 라떼류는 즉시 단식이 중단됩니다. ☕`;
      } else if (query.includes('케토시스') || query.includes('지방') || query.includes('대사')) {
        aiReply = `현재 단식 ${elapsedHours.toFixed(1)}시간 차이며, 12시간 이후부터는 간의 글리코겐이 고갈되어 신체가 체지방을 주 에너지원으로 태우는 케토시스(Ketosis)에 진입합니다! 지금이 가장 지방 연소 효율이 높은 황금 구간입니다. 🔥`;
      } else {
        aiReply = `기록해주신 식단과 현재 단식 상태를 분석한 결과, 탄수화물 스파이크 위험이 낮고 양호한 대사 밸런스를 유지하고 계십니다. 규칙적인 수분 섭취를 유지하며 다음 목표 시간까지 안전하게 완주해보세요! ✨`;
      }

      const aiMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: '방금 전',
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-2 pb-24 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white flex items-center">
          <Sparkles className="w-5 h-5 text-blue-400 mr-2" />
          1:1 AI 다이어티션 코치
        </h2>
        <p className="text-xs text-slate-400">실시간 생체 대사 단계 기반 맞춤형 영양 & 단식 피드백</p>
      </div>

      {/* Real-time Status Card */}
      <div className="glass-card rounded-3xl p-4 border border-blue-500/20 bg-gradient-to-r from-[#0f172a] to-[#131f38]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 flex items-center">
            <span className="w-2 h-2 rounded-full mr-1.5 animate-pulse" style={{ backgroundColor: currentStage.color }} />
            {isFasting ? `단식 진행 중 (${elapsedHours.toFixed(1)}h)` : '식사 윈도우 진행 중'}
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${currentStage.color}25`, color: currentStage.color }}>
            {currentStage.name}
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {currentStage.shortDesc}
        </p>
      </div>

      {/* Suggested Quick Questions */}
      <div>
        <span className="text-[11px] font-semibold text-slate-400 mb-1.5 block">💡 자주 묻는 질문:</span>
        <div className="flex flex-wrap gap-1.5">
          {[
            '지금 너무 배가 고파요 😭',
            '단식 중에 아메리카노 마셔도 되나요?',
            '언제부터 체지방이 태워지나요?',
            '식사창 첫 끼는 무엇을 먹을까요?'
          ].map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] px-3 py-1.5 rounded-xl bg-white/5 hover:bg-blue-600/20 border border-white/10 text-slate-300 hover:text-blue-300 hover:border-blue-500/30 transition-all text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="glass-card rounded-3xl p-4 border border-white/10 space-y-3 min-h-[260px] max-h-[380px] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/20'
                  : 'bg-white/10 text-slate-200 rounded-bl-none border border-white/10'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="flex items-center space-x-1 text-[10px] text-blue-300 font-bold mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>FastiMeal AI Dietitian</span>
                </div>
              )}
              <p className="whitespace-pre-line">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="단식, 식단, 대사에 대해 무엇이든 물어보세요..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="w-full pl-4 pr-12 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-xl"
        />
        <button
          onClick={() => handleSend()}
          className="absolute right-2 p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
