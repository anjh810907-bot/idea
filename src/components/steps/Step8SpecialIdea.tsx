import React from 'react';
import { Star, Sparkles, Check } from 'lucide-react';
import { SPECIAL_IDEA_CHIPS } from '../../data/wizardData';
import { MascotConfig } from '../../types';

interface Step8SpecialIdeaProps {
  specialIdea: string;
  selectedSpecialIdeaChip: string;
  mascot: MascotConfig | null;
  onChangeSpecialIdea: (text: string) => void;
  onSelectSpecialChip: (chipText: string) => void;
}

export const Step8SpecialIdea: React.FC<Step8SpecialIdeaProps> = ({
  specialIdea,
  selectedSpecialIdeaChip,
  mascot,
  onChangeSpecialIdea,
  onSelectSpecialChip,
}) => {
  return (
    <div className="space-y-6">
      {/* Title & Guidance */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 text-yellow-900 text-xs font-bold">
          <Star className="w-3.5 h-3.5 text-yellow-600 fill-yellow-500" />
          <span>8단계: 다른 앱에는 없는 나만의 특별한 아이디어!</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
          이 앱을 쓰면 기분이 좋아지는 특별한 '킬러 아이디어'를 적어줘!
        </h3>
        <p className="text-sm text-slate-600">
          앱을 만들 때 가장 재미있고 특별한 포인트 하나를 넣어보세요. 상상력에는 한계가 없어요!
        </p>
      </div>

      {/* Special Idea Textarea */}
      <div className="relative">
        <textarea
          value={specialIdea}
          onChange={(e) => onChangeSpecialIdea(e.target.value)}
          placeholder={`예: 미션을 성공하면 ${mascot?.name || '마스코트'}가 축하 폭죽을 터뜨려주고 레벨이 올라가요! 3일 연속 성공하면 황금 왕관을 씌워줘요.`}
          rows={4}
          className="w-full p-4 sm:p-5 rounded-3xl border-2 border-yellow-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 outline-none text-base text-slate-800 placeholder:text-slate-400 transition-all bg-yellow-50/20 shadow-inner"
        />
        <div className="flex justify-between items-center px-2 mt-1 text-xs text-slate-400">
          <span>AI 코딩 도구가 이 아이디어를 핵심 연출로 구현해 줍니다!</span>
          <div className="flex items-center gap-3">
            {specialIdea && (
              <button
                type="button"
                onClick={() => onChangeSpecialIdea('')}
                className="text-yellow-700 hover:text-yellow-900 font-semibold cursor-pointer underline underline-offset-2"
              >
                지우기
              </button>
            )}
            <span>{specialIdea.length}자 입력됨</span>
          </div>
        </div>
      </div>

      {/* Inspirational Creative Chips */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-600 fill-yellow-400" />
            <h4 className="text-sm font-bold text-slate-700">
              학생들이 좋아하는 킬러 아이디어 예시 (클릭하면 바로 적용돼요)
            </h4>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            * 칩을 누르면 기존 내용 대신 선택한 문장만 깔끔하게 들어갑니다
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SPECIAL_IDEA_CHIPS.map((chip, idx) => {
            const isSelected = selectedSpecialIdeaChip === chip;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectSpecialChip(chip)}
                className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-yellow-100/90 border-yellow-400 ring-2 ring-yellow-300 font-extrabold text-yellow-950 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-yellow-300 hover:bg-yellow-50/30 text-slate-700 shadow-2xs'
                }`}
              >
                <span>{chip}</span>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-yellow-500 text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
