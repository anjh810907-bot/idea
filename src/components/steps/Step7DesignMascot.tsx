import React from 'react';
import { Palette, Sparkles, Check, Heart, MessageCircle } from 'lucide-react';
import { DESIGN_STYLES, COLOR_PALETTES, MASCOTS } from '../../data/wizardData';
import { MascotConfig } from '../../types';

interface Step7DesignMascotProps {
  designStyle: string;
  themeColor: string;
  mascot: MascotConfig | null;
  customDesignNotes: string;
  onSelectStyle: (styleName: string) => void;
  onSelectColor: (colorName: string) => void;
  onSelectMascot: (mascot: MascotConfig) => void;
  onChangeMascotPhrase: (phrase: string) => void;
  onChangeCustomNotes: (notes: string) => void;
}

export const Step7DesignMascot: React.FC<Step7DesignMascotProps> = ({
  designStyle,
  themeColor,
  mascot,
  customDesignNotes,
  onSelectStyle,
  onSelectColor,
  onSelectMascot,
  onChangeMascotPhrase,
  onChangeCustomNotes,
}) => {
  return (
    <div className="space-y-8">
      {/* Title & Guidance */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-900 text-xs font-bold">
          <Palette className="w-3.5 h-3.5 text-pink-600" />
          <span>7단계: 나만의 감성으로 예쁘게 꾸며볼까요?</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
          디자인 스타일, 테마 색상 & 응원 마스코트 선택
        </h3>
        <p className="text-sm text-slate-600">
          앱의 분위기를 결정짓는 비주얼 스타일과 함께, 사용자를 격려해 줄 귀여운 동물 마스코트를 골라보세요.
        </p>
      </div>

      {/* 1. Visual Style Selector */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
          <span>🎨 어떤 비주얼 스타일이 마음에 드나요?</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DESIGN_STYLES.map((style) => {
            const isSelected = designStyle === style.name;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onSelectStyle(style.name)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 relative ${
                  isSelected
                    ? `${style.bgClass} ring-2 ring-amber-400 shadow-xs`
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm sm:text-base text-slate-800">
                    {style.name}
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/80 border border-slate-200">
                    {style.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">{style.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Theme Color Selector */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
          <span>🌈 앱의 메인 테마 색상을 골라주세요</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {COLOR_PALETTES.map((palette) => {
            const isSelected = themeColor === palette.name;
            return (
              <button
                key={palette.id}
                type="button"
                onClick={() => onSelectColor(palette.name)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                  isSelected
                    ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-5 h-5 rounded-full border border-black/10 shadow-xs flex-shrink-0"
                    style={{ backgroundColor: palette.primary }}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0"
                    style={{ backgroundColor: palette.secondary }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-800 truncate">
                  {palette.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Cute Mascots Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            <span>앱에서 나와 친구들을 응원해 줄 마스코트 친구는?</span>
          </h4>
          <span className="text-xs text-pink-600 font-bold">클릭하여 선택</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {MASCOTS.map((m) => {
            const isSelected = mascot?.id === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelectMascot(m)}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  isSelected
                    ? `${m.avatarBg} ring-2 ring-pink-400 shadow-xs scale-105`
                    : 'bg-white border-slate-200 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                <div className="text-3xl sm:text-4xl mb-0.5">{m.emoji}</div>
                <div className="font-extrabold text-xs sm:text-sm text-slate-800">
                  {m.name}
                </div>
                <div className="text-[10px] text-slate-500">{m.animal}</div>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mascot Live Speech Bubble */}
        {mascot ? (
          <div className="p-4 rounded-3xl bg-pink-50 border border-pink-200 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="text-4xl p-2 rounded-2xl bg-white border border-pink-200 shadow-2xs">
              {mascot.emoji}
            </div>
            <div className="flex-1 space-y-2 w-full">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-pink-900">
                  {mascot.name} ({mascot.animal})의 응원 대사:
                </span>
                <MessageCircle className="w-4 h-4 text-pink-500" />
              </div>
              <input
                type="text"
                value={mascot.cheerPhrase}
                onChange={(e) => onChangeMascotPhrase(e.target.value)}
                placeholder="마스코트가 화면에서 해줄 응원 문구를 적어주세요!"
                className="w-full px-4 py-2 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-xs sm:text-sm bg-white"
              />
              <p className="text-[11px] text-pink-700">
                * 문제를 맞히거나 미션을 완료할 때 마스코트가 이 대사를 말풍선으로 띄워줍니다!
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-pink-50/50 border border-dashed border-pink-200 text-center text-xs text-slate-500">
            위에서 마음에 드는 마스코트 친구를 클릭해 보세요! (선택하지 않고 넘어가도 괜찮아요)
          </div>
        )}
      </div>

      {/* Free-form Custom Design Notes */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 block">
          ✏️ 버튼 모양이나 애니메이션 등 추가로 원하는 디자인 요구사항이 있나요?
        </label>
        <input
          type="text"
          value={customDesignNotes}
          onChange={(e) => onChangeCustomNotes(e.target.value)}
          placeholder="예: 버튼을 누를 때마다 젤리처럼 통통 튀는 애니메이션을 넣어줘, 모서리를 아주 둥글게 해줘"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-xs sm:text-sm bg-white"
        />
      </div>
    </div>
  );
};
