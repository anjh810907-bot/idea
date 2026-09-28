import React, { useState } from 'react';
import { Sliders, Sparkles, Check, ArrowRight } from 'lucide-react';
import { FEATURE_CONFIGS } from '../../data/wizardData';

interface Step5FeatureDetailsProps {
  selectedFeatures: string[];
  featureDetails: Record<string, Record<string, string>>;
  onUpdateDetail: (featureId: string, questionKey: string, value: string) => void;
  onGoToStep4: () => void;
}

export const Step5FeatureDetails: React.FC<Step5FeatureDetailsProps> = ({
  selectedFeatures,
  featureDetails,
  onUpdateDetail,
  onGoToStep4,
}) => {
  // If user selected features, pick the first one as active tab
  const [activeFeatureId, setActiveFeatureId] = useState<string>(
    selectedFeatures[0] || ''
  );

  // If activeFeatureId is not in selectedFeatures, update it
  const currentTab = selectedFeatures.includes(activeFeatureId)
    ? activeFeatureId
    : selectedFeatures[0] || '';

  const activeConfig = FEATURE_CONFIGS.find((f) => f.id === currentTab);

  if (selectedFeatures.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-3xl bg-amber-50/60 border-2 border-dashed border-amber-200 space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-2xl font-black">
          ⚡
        </div>
        <h3 className="text-lg sm:text-xl font-black text-slate-800">
          아직 4단계에서 선택한 기능이 없어요!
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          퀴즈, 타이머, 할 일 등 원하는 핵심 기능을 먼저 4단계에서 골라주시면, 그 기능에 딱 맞는 세부 규칙을 이곳에서 설정할 수 있습니다.
        </p>
        <button
          type="button"
          onClick={onGoToStep4}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-sm transition-all cursor-pointer"
        >
          <span>4단계로 기능 선택하러 가기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title & Guidance */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-bold">
          <Sliders className="w-3.5 h-3.5 text-orange-600" />
          <span>5단계: 선택한 기능들이 어떻게 동작해야 할까요?</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
          각 기능별 상세 규칙과 동작 방식을 정해주세요
        </h3>
        <p className="text-sm text-slate-600">
          4단계에서 고른 기능 탭을 하나씩 누르고, 원하는 세부 방식을 선택하거나 적어보세요. AI 코딩 도구가 이 규칙대로 프로그램을 만듭니다.
        </p>
      </div>

      {/* Feature Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {selectedFeatures.map((featId) => {
          const cfg = FEATURE_CONFIGS.find((f) => f.id === featId);
          const isCurrent = currentTab === featId;
          const detailsCount = Object.keys(featureDetails[featId] || {}).length;

          return (
            <button
              key={featId}
              type="button"
              onClick={() => setActiveFeatureId(featId)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                isCurrent
                  ? 'bg-orange-500 text-white shadow-md ring-2 ring-orange-300'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-orange-50'
              }`}
            >
              <span>{cfg ? cfg.name : featId}</span>
              {detailsCount > 0 && (
                <span
                  className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    isCurrent ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Questions Form */}
      {activeConfig && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-orange-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-orange-100">
            <div>
              <h4 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <span>{activeConfig.name}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold">
                  세부 규칙 설정
                </span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeConfig.description}
              </p>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              질문 {activeConfig.suggestedQuestions.length}개
            </div>
          </div>

          <div className="space-y-5">
            {activeConfig.suggestedQuestions.map((q) => {
              const currentValue =
                featureDetails[activeConfig.id]?.[q.key] || q.defaultValue;

              return (
                <div key={q.key} className="space-y-2.5">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <span>{q.question}</span>
                  </label>

                  {/* Option Chips (Selectable pills) */}
                  {q.options && q.options.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {q.options.map((opt) => {
                        const isSelected = currentValue === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() =>
                              onUpdateDetail(activeConfig.id, q.key, opt)
                            }
                            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-orange-100 text-orange-950 font-bold ring-2 ring-orange-400 border-transparent shadow-xs'
                                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Free-form custom fine-tuning input */}
                  <div className="pt-1">
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(e) =>
                        onUpdateDetail(activeConfig.id, q.key, e.target.value)
                      }
                      placeholder={q.placeholder || '직접 원하는 방식을 적어도 좋아요!'}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-xs sm:text-sm bg-slate-50/50"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
