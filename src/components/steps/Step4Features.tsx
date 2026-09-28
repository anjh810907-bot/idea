import React, { useState } from 'react';
import {
  Zap,
  HelpCircle,
  Clock,
  Trophy,
  CheckSquare,
  Dices,
  Award,
  Save,
  Calculator,
  Palette,
  Medal,
  Volume2,
  Sparkles,
  Search,
  Share2,
  Target,
  SunMoon,
  Check,
} from 'lucide-react';
import { FEATURE_CONFIGS } from '../../data/wizardData';

interface Step4FeaturesProps {
  selectedFeatures: string[];
  onToggleFeature: (featureId: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  HelpCircle: <HelpCircle className="w-5 h-5 text-indigo-500" />,
  Clock: <Clock className="w-5 h-5 text-amber-500" />,
  Trophy: <Trophy className="w-5 h-5 text-yellow-500" />,
  CheckSquare: <CheckSquare className="w-5 h-5 text-emerald-500" />,
  Dices: <Dices className="w-5 h-5 text-pink-500" />,
  Award: <Award className="w-5 h-5 text-purple-500" />,
  Save: <Save className="w-5 h-5 text-blue-500" />,
  Calculator: <Calculator className="w-5 h-5 text-cyan-500" />,
  Palette: <Palette className="w-5 h-5 text-rose-500" />,
  Medal: <Medal className="w-5 h-5 text-orange-500" />,
  Volume2: <Volume2 className="w-5 h-5 text-teal-500" />,
  Sparkles: <Sparkles className="w-5 h-5 text-violet-500" />,
  Search: <Search className="w-5 h-5 text-sky-500" />,
  Share2: <Share2 className="w-5 h-5 text-lime-600" />,
  Target: <Target className="w-5 h-5 text-red-500" />,
  SunMoon: <SunMoon className="w-5 h-5 text-slate-600" />,
};

export const Step4Features: React.FC<Step4FeaturesProps> = ({
  selectedFeatures,
  onToggleFeature,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'core' | 'game' | 'utility' | 'social'>('all');

  const filtered = FEATURE_CONFIGS.filter((feat) => {
    if (filterCategory === 'all') return true;
    return feat.category === filterCategory;
  });

  return (
    <div className="space-y-6">
      {/* Title & Guidance */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-900 text-xs font-bold">
          <Zap className="w-3.5 h-3.5 text-violet-600" />
          <span>4단계: 앱에 꼭 들어갔으면 하는 핵심 기능들을 골라주세요!</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            16가지 이상의 기능 카드 중 마음에 드는 기능을 선택하세요
          </h3>
          <span className="text-xs font-bold text-violet-700 bg-violet-50 px-3 py-1.5 rounded-full border border-violet-200 self-start sm:self-auto">
            현재 {selectedFeatures.length}개 선택됨
          </span>
        </div>
        <p className="text-sm text-slate-600">
          선택한 기능들은 5단계에서 세부 규칙(문제 수, 타이머 모드 등)을 상세히 다듬게 됩니다.
        </p>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: '전체 (16개)' },
          { id: 'core', label: '📌 핵심 & 저장' },
          { id: 'game', label: '🎮 게임 & 재미' },
          { id: 'utility', label: '🛠️ 유용한 도구' },
          { id: 'social', label: '🏆 보상 & 소셜' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterCategory(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filterCategory === tab.id
                ? 'bg-violet-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((feat) => {
          const isSelected = selectedFeatures.includes(feat.id);
          return (
            <button
              key={feat.id}
              type="button"
              onClick={() => onToggleFeature(feat.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-violet-50/80 border-violet-400 ring-2 ring-violet-300 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-violet-300 hover:bg-violet-50/20 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-2xs">
                    {ICON_MAP[feat.iconName] || <Zap className="w-5 h-5 text-violet-500" />}
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-violet-600 text-white' : 'border border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
                <div className="font-extrabold text-sm sm:text-base text-slate-800 mb-1">
                  {feat.name}
                </div>
                <div className="text-xs text-slate-500 line-clamp-2">
                  {feat.description}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>세부 규칙 {feat.suggestedQuestions.length}개 설정 가능</span>
                <span className="text-violet-600 font-bold">5단계에서 상세화</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
