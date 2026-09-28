import React from 'react';
import { Lightbulb, Sparkles, Check } from 'lucide-react';
import { IDEA_CHIPS } from '../../data/wizardData';
import { MascotConfig } from '../../types';

interface Step1IdeaProps {
  ideaText: string;
  selectedIdeaChip: string;
  mascot: MascotConfig | null;
  onChangeIdea: (text: string) => void;
  onSelectChip: (chipTitle: string, chipDesc: string, fullText?: string) => void;
}

export const Step1Idea: React.FC<Step1IdeaProps> = ({
  ideaText,
  selectedIdeaChip,
  mascot,
  onChangeIdea,
  onSelectChip,
}) => {
  return (
    <div className="space-y-6">
      {/* Title & Guidance */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
          <span>1단계: 어떤 웹앱을 만들어보고 싶나요?</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
          머릿속에 떠오른 반짝이는 아이디어를 자유롭게 들려줘!
        </h3>
        <p className="text-sm text-slate-600">
          복잡하게 쓰지 않아도 괜찮아요. 아래 6가지 인기 주제 칩을 누르면 설명글이 자동으로 쏙 들어가고, 언제든 자유롭게 고쳐 쓸 수 있어요.
        </p>
      </div>

      {/* Idea Textarea */}
      <div className="relative">
        <textarea
          value={ideaText}
          onChange={(e) => onChangeIdea(e.target.value)}
          placeholder="예: 우리 반 친구들과 공부할 때 25분 동안 집중하면 귀여운 다람쥐가 도토리를 모으는 타이머 앱을 만들고 싶어요! 퀴즈도 풀 수 있으면 좋겠어요."
          rows={4}
          className="w-full p-4 sm:p-5 rounded-3xl border-2 border-amber-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none text-base text-slate-800 placeholder:text-slate-400 transition-all bg-amber-50/20 shadow-inner"
        />
        <div className="flex justify-between items-center px-2 mt-1 text-xs text-slate-400">
          <span>최소 5자 이상 적어주면 더 멋진 프롬프트가 만들어져요!</span>
          <div className="flex items-center gap-3">
            {ideaText && (
              <button
                type="button"
                onClick={() => onChangeIdea('')}
                className="text-amber-700 hover:text-amber-900 font-semibold cursor-pointer underline underline-offset-2"
              >
                지우기
              </button>
            )}
            <span>{ideaText.length}자 입력됨</span>
          </div>
        </div>
      </div>

      {/* Inspirational Chips */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <h4 className="text-sm font-bold text-slate-700">
              아이디어가 고민된다면? 6가지 추천 주제 칩을 톡 눌러보세요!
            </h4>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            * 칩을 누르면 위 문장이 해당 아이디어로 바로 바뀝니다
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {IDEA_CHIPS.map((chip) => {
            const isSelected = selectedIdeaChip === chip.title;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => onSelectChip(chip.title, chip.desc, (chip as any).fullText)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-100/90 border-amber-400 shadow-xs ring-2 ring-amber-300'
                    : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 shadow-2xs'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <div>
                  <div className="font-extrabold text-sm sm:text-base text-slate-800 mb-1.5 pr-6">
                    {chip.title}
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    {chip.desc}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600">
                    {chip.category}
                  </span>
                  <span className="text-[11px] font-semibold text-amber-700">
                    {isSelected ? '선택됨 ✓' : '선택하기 →'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mascot Cheer Tip */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-100/60 border border-amber-200">
        <span className="text-3xl">{mascot?.emoji || '✨'}</span>
        <div>
          <span className="text-xs font-bold text-amber-900 block">
            {mascot?.name ? `${mascot.name}의 한마디` : 'AI 코치의 한마디'}
          </span>
          <p className="text-xs sm:text-sm text-amber-950 font-medium">
            "{mascot?.cheerPhrase || '너만의 멋진 상상을 자유롭게 펼쳐봐!'} 아이디어를 고르거나 적었으면 [다음 단계] 버튼을 꾹 눌러줘!"
          </p>
        </div>
      </div>
    </div>
  );
};
