import React, { useState } from 'react';
import {
  Copy,
  Check,
  Edit3,
  RotateCw,
  Wrench,
  ArrowLeft,
  Save,
  Share2,
} from 'lucide-react';
import { AppBlueprint } from '../types';

interface PromptResultViewProps {
  prompt: string;
  source: 'gemini' | 'fallback';
  blueprint: AppBlueprint;
  onCopy: () => void;
  onRegenerate: () => void;
  onOpenRevisionModal: () => void;
  onBackToWizard: () => void;
  onUpdatePromptText: (newText: string) => void;
  onOpenShareModal?: () => void;
}

export const PromptResultView: React.FC<PromptResultViewProps> = ({
  prompt,
  source,
  blueprint,
  onCopy,
  onRegenerate,
  onOpenRevisionModal,
  onBackToWizard,
  onUpdatePromptText,
  onOpenShareModal,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(prompt);
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(isEditing ? editedText : prompt);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    onUpdatePromptText(editedText);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-amber-200 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{blueprint.mascot?.emoji || '🎉'}</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              {blueprint.appName || '학생 웹앱'} 완성형 개발 프롬프트
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {source === 'gemini' ? 'Gemini 3.8 Flash' : '스마트 템플릿'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            아래 지시서를 복사한 뒤, 구글 AI 스튜디오(Google AI Studio)에 붙여넣기만 하면 바로 멋진 웹앱이 완성됩니다!
          </p>
        </div>

        {/* Quick Back button */}
        <button
          type="button"
          onClick={onBackToWizard}
          className="self-start md:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>기획 단계로 돌아가기</span>
        </button>
      </div>

      {/* Primary Actions Button Group */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
        <div className="flex flex-wrap items-center gap-2">
          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopyClick}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '복사 완료!' : '📋 복사하기'}</span>
          </button>

          {/* Edit Toggle Button */}
          <button
            type="button"
            onClick={() => {
              if (isEditing) {
                handleSaveEdit();
              } else {
                setEditedText(prompt);
                setIsEditing(true);
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 font-bold text-sm transition-colors cursor-pointer shadow-2xs"
          >
            {isEditing ? <Save className="w-4 h-4 text-emerald-600" /> : <Edit3 className="w-4 h-4 text-slate-600" />}
            <span>{isEditing ? '저장하고 보기' : '✏️ 직접 수정하기'}</span>
          </button>

          {/* Regenerate Button */}
          <button
            type="button"
            onClick={onRegenerate}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 font-bold text-sm transition-colors cursor-pointer shadow-2xs"
            title="새로운 각도로 다시 생성합니다"
          >
            <RotateCw className="w-4 h-4 text-amber-600" />
            <span>🔄 다시 만들기</span>
          </button>

          {/* Sub-Feature: Revision Prompt Trigger */}
          <button
            type="button"
            onClick={onOpenRevisionModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 hover:bg-indigo-100 font-bold text-sm transition-colors cursor-pointer shadow-2xs"
          >
            <Wrench className="w-4 h-4 text-indigo-600" />
            <span>🛠️ 수정 프롬프트 만들기</span>
          </button>

          {/* Share Work Modal Button */}
          {onOpenShareModal && (
            <button
              type="button"
              onClick={onOpenShareModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all cursor-pointer shadow-sm active:scale-95 ml-auto whitespace-nowrap"
              title="구글 AI 스튜디오에서 만든 작품 링크를 선생님 시트에 제출하기"
            >
              <Share2 className="w-4 h-4 text-emerald-100" />
              <span>공유하기</span>
            </button>
          )}
        </div>
      </div>

      {/* Prompt Editor or Code Viewer Area */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="ml-2 font-mono font-bold text-slate-300">
              {isEditing ? '에디터 모드 (직접 내용 수정 가능)' : 'AI_CODING_PROMPT.md'}
            </span>
          </div>
          <span className="font-mono">
            {(isEditing ? editedText : prompt).length} 글자
          </span>
        </div>

        {isEditing ? (
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            rows={22}
            className="w-full bg-slate-950 text-slate-100 p-4 rounded-2xl font-mono text-xs sm:text-sm border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 leading-relaxed resize-y"
          />
        ) : (
          <pre className="font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-slate-200 select-text overflow-x-auto max-h-[600px] overflow-y-auto pr-2">
            {prompt}
          </pre>
        )}
      </div>

      {/* Friendly Guide on What to do next */}
      <div className="p-5 rounded-3xl bg-white border border-amber-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl p-2 rounded-2xl bg-amber-100 text-amber-900">
            🚀
          </div>
          <div>
            <h4 className="font-black text-sm sm:text-base text-slate-800">
              이제 어떻게 해야 하나요?
            </h4>
            <p className="text-xs text-slate-600">
              1. 상단의 [📋 복사하기] 버튼을 누릅니다.
              <br />
              2. 완성 후 색상이나 동작을 바꾸고 싶을 땐 [🛠️ 수정 프롬프트 만들기]를 이용해 보세요.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyClick}
          className="flex-shrink-0 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md active:scale-95 transition-all cursor-pointer"
        >
          {copied ? '복사 완료!' : '지금 바로 프롬프트 복사하기'}
        </button>
      </div>
    </div>
  );
};
