import React from 'react';
import { Sparkles, RotateCcw, HelpCircle, Trophy, ExternalLink, Share2, ClipboardList } from 'lucide-react';
import { MascotConfig } from '../types';

interface HeaderProps {
  currentStep: number;
  totalSteps: number;
  lastSavedAt: string | null;
  mascot: MascotConfig | null;
  onReset: () => void;
  onOpenHelp: () => void;
  onOpenShareModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  totalSteps,
  lastSavedAt,
  mascot,
  onReset,
  onOpenHelp,
  onOpenShareModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2.5 shrink-0 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-lg sm:text-xl shadow-xs ring-4 ring-amber-100/80 shrink-0">
            {mascot?.emoji || '💡'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-base sm:text-lg text-slate-800 tracking-tight flex items-center gap-1 whitespace-nowrap">
                IdeaSpark <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-400 shrink-0" />
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] sm:text-xs font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-200 whitespace-nowrap">
                학생 기획 스튜디오
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden xl:block whitespace-nowrap truncate max-w-sm">
              10단계로 완성하는 나만의 웹앱 & AI 코딩 프롬프트 생성기
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-nowrap">
          {/* Step Pill */}
          <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 whitespace-nowrap shrink-0">
            <span>진행도</span>
            <span className="text-amber-600 font-extrabold">{currentStep}</span>
            <span className="text-slate-400">/</span>
            <span>{totalSteps} 단계</span>
          </div>

          {/* 1. 대회 신청 Button (Google Forms) */}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSft9jc0OATXDh3vSyFLPBYKHfw6nj29CW1tY8Vpd4J-FCfUyA/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xs transition-all active:scale-95 cursor-pointer border border-amber-400/80 whitespace-nowrap shrink-0"
            title="대회 참가 신청서 작성하기 (구글 폼으로 이동)"
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-100 shrink-0" />
            <span className="whitespace-nowrap">대회 신청</span>
            <ExternalLink className="w-3 h-3 opacity-80 hidden md:inline shrink-0" />
          </a>

          {/* 2. 설문 Button (Google Forms) */}
          <a
            href="https://forms.gle/c7RPDyYZoFnaww5o9"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-xs transition-all active:scale-95 cursor-pointer border border-indigo-400/80 whitespace-nowrap shrink-0"
            title="설문조사 참여하기 (구글 폼으로 이동)"
          >
            <ClipboardList className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-100 shrink-0" />
            <span className="whitespace-nowrap">설문</span>
            <ExternalLink className="w-3 h-3 opacity-80 hidden md:inline shrink-0" />
          </a>

          {/* 3. 공유하기 Button */}
          <button
            type="button"
            onClick={onOpenShareModal}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-95 cursor-pointer border border-emerald-500 whitespace-nowrap shrink-0"
            title="구글 AI 스튜디오 공유 링크를 [학생작품공유] 구글 시트에 제출합니다"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-100 shrink-0" />
            <span className="whitespace-nowrap">공유하기</span>
          </button>

          {/* Help Guide Button */}
          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors shadow-2xs active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
            title="AI 도구 사용 가이드 보기"
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 shrink-0" />
            <span className="whitespace-nowrap hidden sm:inline">도움말</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            title="새로운 기획 시작하기 (초기화)"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="whitespace-nowrap hidden lg:inline">새로 만들기</span>
          </button>
        </div>
      </div>
    </header>
  );
};
