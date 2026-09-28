import React, { useState } from 'react';
import { Smartphone, Sparkles, Check, Plus, Loader2, ArrowRight } from 'lucide-react';
import { SCREEN_TEMPLATES } from '../../data/wizardData';
import { AppBlueprint } from '../../types';
import { recommendScreensWithAI } from '../../utils/gemini';

interface Step6ScreensProps {
  screens: string[];
  screenFlowNotes: string;
  blueprint: Partial<AppBlueprint>;
  onToggleScreen: (screenName: string) => void;
  onAddCustomScreen: (screenName: string) => void;
  onChangeNotes: (notes: string) => void;
  onSetAISuggestions: (suggestions: string[]) => void;
}

export const Step6Screens: React.FC<Step6ScreensProps> = ({
  screens,
  screenFlowNotes,
  blueprint,
  onToggleScreen,
  onAddCustomScreen,
  onChangeNotes,
  onSetAISuggestions,
}) => {
  const [customScreen, setCustomScreen] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiSuggestions, setAiSuggestionsLocal] = useState<string[]>(
    blueprint.aiScreenSuggestions || []
  );

  const handleRecommend = async () => {
    setIsLoadingAI(true);
    try {
      const suggested = await recommendScreensWithAI(blueprint);
      setAiSuggestionsLocal(suggested);
      onSetAISuggestions(suggested);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleAdd = () => {
    if (customScreen.trim()) {
      onAddCustomScreen(customScreen.trim());
      setCustomScreen('');
    }
  };

  const handleApplyAllAI = () => {
    aiSuggestions.forEach((s) => {
      if (!screens.includes(s)) {
        onToggleScreen(s);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Title & Guidance */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold">
          <Smartphone className="w-3.5 h-3.5 text-blue-600" />
          <span>6단계: 어떤 화면들을 거쳐가며 앱을 이용할까요?</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            화면 구성 및 AI 추천 화면 흐름
          </h3>

          {/* AI Screen Recommendation Button */}
          <button
            type="button"
            onClick={handleRecommend}
            disabled={isLoadingAI}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer self-start sm:self-auto disabled:opacity-70"
          >
            {isLoadingAI ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 fill-white/80" />
            )}
            <span>✨ AI 화면 추천받기</span>
          </button>
        </div>
        <p className="text-sm text-slate-600">
          기본 화면을 고르거나, AI 추천 버튼을 눌러 현재 기획에 딱 맞는 화면 흐름을 제안받아 보세요.
        </p>
      </div>

      {/* AI Recommendation Box if available */}
      {aiSuggestions.length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 fill-blue-500" />
              <h4 className="text-sm font-extrabold text-blue-950">
                AI가 추천하는 화면 흐름 제안
              </h4>
            </div>
            <button
              type="button"
              onClick={handleApplyAllAI}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 bg-white/80 px-2.5 py-1 rounded-xl border border-blue-200 cursor-pointer"
            >
              + 전체 추가하기
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {aiSuggestions.map((screenName) => {
              const isAdded = screens.includes(screenName);
              return (
                <button
                  key={screenName}
                  type="button"
                  onClick={() => onToggleScreen(screenName)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isAdded
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-blue-900 border border-blue-200 hover:bg-blue-100/60'
                  }`}
                >
                  <span>{screenName}</span>
                  {isAdded ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Standard Screen Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SCREEN_TEMPLATES.map((tmpl) => {
          const isSelected = screens.includes(tmpl.name);
          return (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => onToggleScreen(tmpl.name)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-300 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-extrabold text-sm sm:text-base text-slate-800">
                  {tmpl.name}
                </span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium">{tmpl.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Add Custom Screen */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <label className="text-xs font-bold text-slate-700 block">
          ➕ 직접 추가하고 싶은 나만의 화면이 있나요?
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customScreen}
            onChange={(e) => setCustomScreen(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="예: 🎁 보물창고 화면, 🎨 캐릭터 꾸미기 옷장"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm bg-white"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>추가</span>
          </button>
        </div>

        {/* Selected Screens Summary Tags */}
        <div className="pt-2">
          <span className="text-xs font-bold text-slate-500 block mb-1.5">
            현재 포함된 화면 목록:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {screens.length === 0 ? (
              <span className="text-xs text-slate-400">선택된 화면이 없습니다.</span>
            ) : (
              screens.map((sc) => (
                <span
                  key={sc}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200"
                >
                  <span>{sc}</span>
                  <button
                    type="button"
                    onClick={() => onToggleScreen(sc)}
                    className="text-blue-700 hover:text-blue-950 font-black ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Screen Flow Notes */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 block">
          💡 화면이 어떻게 전환되면 좋을까요? (선택 사항)
        </label>
        <input
          type="text"
          value={screenFlowNotes}
          onChange={(e) => onChangeNotes(e.target.value)}
          placeholder="예: 홈에서 '시작하기'를 누르면 퀴즈 화면으로 부드럽게 넘어가고, 끝나면 폭죽과 함께 결과 화면이 떠요."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-xs sm:text-sm bg-white"
        />
      </div>
    </div>
  );
};
