import React, { useState } from 'react';
import { X, Wrench, Sparkles, Copy, Check, Loader2, ArrowRight } from 'lucide-react';
import { AppBlueprint, RevisionRequest } from '../types';
import { generateRevisionPromptWithAI } from '../utils/gemini';

interface RevisionModalProps {
  isOpen: boolean;
  blueprint: AppBlueprint;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const RevisionModal: React.FC<RevisionModalProps> = ({
  isOpen,
  blueprint,
  onClose,
  onShowToast,
}) => {
  const [problemDescription, setProblemDescription] = useState('');
  const [category, setCategory] = useState<'ui' | 'bug' | 'feature' | 'speed'>('ui');
  const [specificRequest, setSpecificRequest] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRevisionPrompt, setGeneratedRevisionPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const PRESET_PROBLEMS = [
    { cat: 'ui', text: '버튼과 글자 크기가 작아서 모바일에서 터치하기 불편해요' },
    { cat: 'bug', text: '타이머가 0초가 되었을 때 완료 알림이나 소리가 작동하지 않아요' },
    { cat: 'bug', text: '페이지를 새로고침하면 기록해 둔 데이터가 모두 초기화돼요' },
    { cat: 'ui', text: '배경 색상을 조금 더 화사하고 따뜻한 파스텔 톤으로 바꿔주세요' },
    { cat: 'feature', text: '퀴즈를 다 풀었을 때 폭죽 애니메이션과 뱃지 획득 팝업을 추가해 줘요' },
  ];

  const handleGenerate = async () => {
    if (!problemDescription.trim()) {
      onShowToast('발생한 문제 또는 수정하고 싶은 내용을 적어주세요!');
      return;
    }

    setIsGenerating(true);
    try {
      const revisionReq: RevisionRequest = {
        problemDescription: problemDescription.trim(),
        category,
        specificRequest: specificRequest.trim(),
      };
      const result = await generateRevisionPromptWithAI(blueprint, revisionReq);
      setGeneratedRevisionPrompt(result);
    } catch {
      onShowToast('수정 프롬프트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedRevisionPrompt) return;
    navigator.clipboard.writeText(generatedRevisionPrompt);
    setCopied(true);
    onShowToast('수정 지시 프롬프트가 복사되었습니다!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-indigo-100 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-indigo-100 text-indigo-700">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">
                🛠️ AI 코딩 수정 지시 프롬프트 만들기
              </h3>
              <p className="text-xs text-slate-500">
                v0 / Bolt에서 앱을 만들어 본 뒤 불편한 점이 있다면 맞춤형 수정 프롬프트를 만들어 드립니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            어떤 부분을 고치고 싶나요?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'ui', label: '🎨 UI & 디자인' },
              { id: 'bug', label: '🐛 버그 & 오류' },
              { id: 'feature', label: '✨ 기능 추가' },
              { id: 'speed', label: '⚡ 속도 & 애니메이션' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id as any)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  category === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Problem Presets */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 block">
            자주 겪는 문제 예시 (클릭하면 바로 입력):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_PROBLEMS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setProblemDescription(preset.text);
                  setCategory(preset.cat as any);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100 text-left font-medium transition-colors cursor-pointer"
              >
                + {preset.text}
              </button>
            ))}
          </div>
        </div>

        {/* Problem description input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            발생한 문제 또는 변경하고 싶은 내용:
          </label>
          <textarea
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            rows={3}
            placeholder="예: 버튼을 눌렀을 때 반응이 느려요 / 타이머가 멈추지 않아요 / 글자 색상이 너무 연해서 안 보여요"
            className="w-full p-3.5 rounded-2xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-xs sm:text-sm bg-slate-50/50"
          />
        </div>

        {/* Specific request */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            AI에게 전하고 싶은 구체적인 지시 사항 (선택):
          </label>
          <input
            type="text"
            value={specificRequest}
            onChange={(e) => setSpecificRequest(e.target.value)}
            placeholder="예: 글자 크기를 18px 이상으로 키우고, 모서리를 더 둥글게 해줘."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-xs sm:text-sm bg-white"
          />
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>수정 프롬프트를 만드는 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>수정 프롬프트 생성하기</span>
            </>
          )}
        </button>

        {/* Result Area */}
        {generatedRevisionPrompt && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                생성된 수정 요청 프롬프트:
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-100 text-indigo-900 font-bold text-xs hover:bg-indigo-200 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '복사됨!' : '프롬프트 복사하기'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {generatedRevisionPrompt}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
