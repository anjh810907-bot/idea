import React from 'react';
import { Check } from 'lucide-react';

export interface StepItem {
  id: number;
  title: string;
  shortTitle: string;
  icon: string;
}

export const WIZARD_STEPS: StepItem[] = [
  { id: 1, title: '1. 아이디어 입력', shortTitle: '아이디어', icon: '💡' },
  { id: 2, title: '2. 앱의 목적', shortTitle: '목적', icon: '🎯' },
  { id: 3, title: '3. 대상 사용자', shortTitle: '사용자', icon: '👥' },
  { id: 4, title: '4. 핵심 기능 선택', shortTitle: '기능', icon: '⚡' },
  { id: 5, title: '5. 세부 규칙 설정', shortTitle: '세부 규칙', icon: '⚙️' },
  { id: 6, title: '6. 화면 구성 & AI', shortTitle: '화면', icon: '📱' },
  { id: 7, title: '7. 디자인 & 마스코트', shortTitle: '디자인', icon: '🎨' },
  { id: 8, title: '8. 킬러 아이디어', shortTitle: '특별 기능', icon: '🌟' },
  { id: 9, title: '9. 앱 이름 짓기', shortTitle: '이름', icon: '🏷️' },
  { id: 10, title: '10. 프롬프트', shortTitle: '프롬프트', icon: '✨' },
];

interface StepProgressBarProps {
  currentStep: number;
  maxStepReached?: number;
  onStepClick: (stepId: number) => void;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  maxStepReached = 1,
  onStepClick,
}) => {
  const percentage = Math.round(((currentStep - 1) / (WIZARD_STEPS.length - 1)) * 100);

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-100 shadow-sm mb-6">
      {/* Upper Status & Percentage */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{WIZARD_STEPS[currentStep - 1]?.icon}</span>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
              {WIZARD_STEPS[currentStep - 1]?.title}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              10단계 중 {currentStep}단계 진행 중
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            {percentage}% 완성
          </span>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300 rounded-full"
          style={{ width: `${Math.max(5, percentage)}%` }}
        />
      </div>

      {/* Stepper Dots / Icons */}
      <div className="w-full flex items-center justify-between gap-0.5 sm:gap-1 overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5">
        {WIZARD_STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick(step.id)}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center p-1 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'cursor-default'
                  : 'hover:bg-amber-50/60 active:scale-95'
              }`}
              title={`${step.title} (클릭하여 이동)`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black mb-1 transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-500 text-white shadow-2xs'
                    : 'bg-amber-100/70 text-amber-900 font-bold hover:bg-amber-200'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] truncate max-w-full text-center leading-tight transition-colors ${
                  isActive
                    ? 'text-amber-600 font-black'
                    : isCompleted
                    ? 'text-slate-600 font-medium'
                    : 'text-slate-500 font-medium'
                }`}
              >
                {step.shortTitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
