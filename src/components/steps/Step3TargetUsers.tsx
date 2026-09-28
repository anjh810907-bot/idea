import React, { useState } from 'react';
import { Users, Check, Plus, X } from 'lucide-react';
import { TARGET_USERS } from '../../data/wizardData';

interface Step3TargetUsersProps {
  targetUsers: string[];
  customTargetUser: string;
  onToggleUser: (userLabel: string) => void;
  onSetCustomUser: (text: string) => void;
}

export const Step3TargetUsers: React.FC<Step3TargetUsersProps> = ({
  targetUsers,
  customTargetUser,
  onToggleUser,
  onSetCustomUser,
}) => {
  const [customInput, setCustomInput] = useState('');

  const handleAddCustom = () => {
    if (customInput.trim()) {
      onSetCustomUser(customInput.trim());
      setCustomInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Guidance */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold">
          <Users className="w-3.5 h-3.5 text-sky-600" />
          <span>3단계: 이 앱을 주로 누가 사용하게 될까요?</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
          앱의 주인공이 될 대상 사용자를 선택해 주세요 (다중 선택 가능)
        </h3>
        <p className="text-sm text-slate-600">
          사용자가 누구인지 명확히 알면, AI 코딩 도구가 버튼 크기나 설명 어투를 맞춤형으로 구현해 줍니다.
        </p>
      </div>

      {/* Target Users Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {TARGET_USERS.map((user) => {
          const isSelected = targetUsers.includes(user.label);
          return (
            <button
              key={user.id}
              type="button"
              onClick={() => onToggleUser(user.label)}
              className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                isSelected
                  ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-300 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-sky-200 hover:bg-sky-50/20 shadow-2xs'
              }`}
            >
              <div className="text-3xl">{user.emoji}</div>
              <div className="font-extrabold text-sm sm:text-base text-slate-800">
                {user.label}
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-sky-500 text-white' : 'border border-slate-300'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom User Input */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
        <label className="text-xs font-bold text-slate-700 block">
          👥 다른 특별한 대상이 있나요?
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
            placeholder="예: 우리 학교 방송부원, 방과 후 코딩 교실 친구들"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none text-sm bg-white"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>추가</span>
          </button>
        </div>

        {customTargetUser && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-100 text-sky-900 text-xs font-bold border border-sky-200">
            <span>추가된 사용자: {customTargetUser}</span>
            <button
              onClick={() => onSetCustomUser('')}
              className="text-sky-700 hover:text-sky-950 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
