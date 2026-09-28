import React from 'react';
import { X, ExternalLink, Sparkles, Key, CheckCircle2, Laptop } from 'lucide-react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-100 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="text-lg font-black text-slate-800">
                IdeaSpark & AI 코딩 도구 이용 가이드
              </h3>
              <p className="text-xs text-slate-500">
                학생 기획자가 아이디어를 실제 웹앱으로 만드는 쉬운 방법
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

        {/* 4 Simple Steps */}
        <div className="space-y-3">
          <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>AI 코딩 4단계 레시피</span>
          </h4>

          <div className="space-y-2.5">
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black flex-shrink-0">
                1
              </span>
              <div>
                <span className="text-xs font-bold text-amber-950 block">
                  10단계 마법사로 아이디어 완성하기
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  앱의 목적, 기능 세부 규칙, 응원 마스코트까지 차근차근 골라보세요. 입력한 내용은 자동으로 브라우저에 임시 저장됩니다.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black flex-shrink-0">
                2
              </span>
              <div>
                <span className="text-xs font-bold text-emerald-950 block">
                  [📋 복사하기] 버튼 누르기
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  10단계에서 [AI 웹앱 제작 프롬프트 만들기]를 누르면 고품질 코딩 지시서가 완성됩니다. [📋 복사하기]를 꾹 눌러주세요.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-black flex-shrink-0">
                3
              </span>
              <div>
                <span className="text-xs font-bold text-sky-950 block">
                  v0 / Bolt / Lovable에 붙여넣기
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  v0.dev 또는 Bolt.new에 접속하여 대화창에 복사한 프롬프트를 붙여넣고 엔터를 치면 단 몇 초 만에 실제 작동하는 웹앱이 만들어집니다!
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black flex-shrink-0">
                4
              </span>
              <div>
                <span className="text-xs font-bold text-indigo-950 block">
                  필요할 땐 [🛠️ 수정 프롬프트 만들기]
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  "버튼이 작아요", "색상을 바꾸고 싶어요" 등 고치고 싶은 점이 생기면 수정 프롬프트를 만들어 다시 AI에게 보내보세요.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gemini API & Resilient Fallback Notice */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-slate-600" />
            <h5 className="text-xs font-bold text-slate-800">
              안정적인 오프라인 스마트 생성 엔진 탑재
            </h5>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            IdeaSpark는 Google Gemini 3.8 Flash AI API와 완벽하게 연동되며, API 키가 없거나 네트워크가 불안정한 환경에서도 내장된 고성능 템플릿 합성 엔진이 가동되어 100% 멈춤 없이 완벽한 결과물을 생성합니다.
          </p>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-sm transition-colors cursor-pointer"
        >
          확인했습니다, 기획하러 가기
        </button>
      </div>
    </div>
  );
};
