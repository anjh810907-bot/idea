import React, { useState } from 'react';
import { Target, Check, Plus, X } from 'lucide-react';
import { PURPOSES } from '../../data/wizardData';

interface Step2PurposeProps {
  purposes: string[];
  customPurpose: string;
  onTogglePurpose: (purposeLabel: string) => void;
  onSetCustomPurpose: (text: string) => void;
}

export const Step2Purpose: React.FC<Step2PurposeProps> = ({
  purposes,
  customPurpose,
  onTogglePurpose,
  onSetCustomPurpose,
}) => {
  const [customInput, setCustomInput] = useState('');

  const handleAddCustom = () => {
    if (customInput.trim()) {
      onSetCustomPurpose(customInput.trim());
      setCustomInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Guidance */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
          <Target className="w-3.5 h-3.5 text-emerald-600" />
          <span>2단계: 이 앱을 만드는 가장 큰 이유는 무엇인가요?</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
          웹앱의 목적을 선택해 주세요 (여러 개 선택 가능!)
        </h3>
        <p className="text-sm text-slate-600">
          앱이 사용자에게 줄 수 있는 가장 큰 가치를 골라보세요. 여러 개를 조합해도 좋아요!
        </p>
      </div>

      {/* Purpose Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PURPOSES.map((item) => {
          const isSelected = purposes.includes(item.label);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTogglePurpose(item.label)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/20 shadow-2xs'
              }`}
            >
              <div>
                <div className="font-extrabold text-sm sm:text-base text-slate-800 mb-1">
                  {item.label}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {item.desc}
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected ? 'bg-emerald-500 text-white' : 'border border-slate-300'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Purpose Input */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
        <label className="text-xs font-bold text-slate-700 block">
          ✏️ 직접 입력하고 싶은 특별한 목적이 있나요?
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustom();
              }
            }}
            placeholder="예: 우리 동아리 발표회에서 친구들에게 보여줄 전시용 앱"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm bg-white"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>추가</span>
          </button>
        </div>

        {customPurpose && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200">
            <span>직접 입력됨: {customPurpose}</span>
            <button
              onClick={() => onSetCustomPurpose('')}
              className="text-emerald-700 hover:text-emerald-950 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
