import React, { useState } from 'react';
import { Tag, Sparkles, Check, Loader2, Award } from 'lucide-react';
import { AppBlueprint } from '../../types';
import { recommendNamesWithAI } from '../../utils/gemini';

interface Step9AppNameProps {
  appName: string;
  appSlogan: string;
  aiNameSuggestions: Array<{ name: string; slogan: string; reason: string }>;
  blueprint: Partial<AppBlueprint>;
  onChangeName: (name: string) => void;
  onChangeSlogan: (slogan: string) => void;
  onSetAISuggestions: (
    suggestions: Array<{ name: string; slogan: string; reason: string }>
  ) => void;
}

export const Step9AppName: React.FC<Step9AppNameProps> = ({
  appName,
  appSlogan,
  aiNameSuggestions,
  blueprint,
  onChangeName,
  onChangeSlogan,
  onSetAISuggestions,
}) => {
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleRecommendNames = async () => {
    setIsLoadingAI(true);
    try {
      const names = await recommendNamesWithAI(blueprint);
      onSetAISuggestions(names);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleApplyName = (name: string, slogan: string) => {
    onChangeName(name);
    onChangeSlogan(slogan);
  };

  return (
    <div className="space-y-6">
      {/* Title & Guidance */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-bold">
          <Tag className="w-3.5 h-3.5 text-teal-600" />
          <span>9단계: 사람들의 기억에 쏙 남을 멋진 앱 이름을 지어주세요!</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            앱 이름과 한 줄 슬로건 정하기
          </h3>

          {/* AI Name Recommendation Button */}
          <button
            type="button"
            onClick={handleRecommendNames}
            disabled={isLoadingAI}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer self-start sm:self-auto disabled:opacity-70"
          >
            {isLoadingAI ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 fill-white/80" />
            )}
            <span>✨ AI에게 3가지 이름 추천받기</span>
          </button>
        </div>
        <p className="text-sm text-slate-600">
          직접 지어도 좋고, AI가 기획 내용을 분석해 제안해 주는 센스 넘치는 이름 3가지를 둘러보고 클릭해도 좋아요!
        </p>
      </div>

      {/* Inputs for Name & Slogan */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-teal-200 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            🏷️ 앱 이름 (직접 입력)
          </label>
          <input
            type="text"
            value={appName}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder="예: 도토리 뽀모, 퀴즈 팡팡, 스마트 포켓"
            className="w-full px-4 py-3 rounded-2xl border-2 border-teal-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none text-base font-extrabold text-slate-800 placeholder:text-slate-400 bg-teal-50/20"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            💬 한 줄 슬로건 (앱을 한마디로 소개하는 문구)
          </label>
          <input
            type="text"
            value={appSlogan}
            onChange={(e) => onChangeSlogan(e.target.value)}
            placeholder="예: 다람쥐와 함께 25분 집중하고 도토리 모으기!"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none text-sm text-slate-700 bg-white"
          />
        </div>
      </div>

      {/* AI Name Suggestions Cards */}
      {aiNameSuggestions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 fill-teal-500" />
            <h4 className="text-sm font-extrabold text-teal-950">
              AI가 추천하는 이름 3가지 (클릭 시 바로 적용!)
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiNameSuggestions.map((item, idx) => {
              const isApplied = appName === item.name;
              return (
                <div
                  key={idx}
                  onClick={() => handleApplyName(item.name, item.slogan)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 relative ${
                    isApplied
                      ? 'bg-teal-50 border-teal-400 ring-2 ring-teal-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                        후보 {idx + 1}
                      </span>
                      {isApplied && (
                        <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div className="font-black text-base text-slate-800 mb-0.5">
                      {item.name}
                    </div>
                    <div className="text-xs text-teal-900 font-bold mb-2">
                      "{item.slogan}"
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-2">
                      💡 {item.reason}
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`w-full py-1.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer ${
                      isApplied
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-teal-100 hover:text-teal-900'
                    }`}
                  >
                    {isApplied ? '선택됨' : '이 이름으로 적용'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
