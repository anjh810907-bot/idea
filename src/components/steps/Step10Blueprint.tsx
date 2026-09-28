import React from 'react';
import {
  FileCheck,
  Sparkles,
  Loader2,
  CheckCircle2,
  Laptop,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { AppBlueprint } from '../../types';
import { FEATURE_CONFIGS } from '../../data/wizardData';

interface Step10BlueprintProps {
  blueprint: AppBlueprint;
  isGeneratingPrompt: boolean;
  onSelectTargetTool?: (tool: 'v0' | 'bolt' | 'lovable' | 'claude' | 'general') => void;
  onGeneratePrompt: () => void;
  onJumpToStep: (stepId: number) => void;
}

export const Step10Blueprint: React.FC<Step10BlueprintProps> = ({
  blueprint,
  isGeneratingPrompt,
  onGeneratePrompt,
  onJumpToStep,
}) => {
  const mascot = blueprint.mascot;
  const appName = blueprint.appName || '학생 맞춤형 웹앱';
  const slogan = blueprint.appSlogan || '학생을 위한 스마트 웹 애플리케이션';

  const featureNames = blueprint.features
    .map((id) => FEATURE_CONFIGS.find((f) => f.id === id)?.name || id)
    .join(', ');

  return (
    <div className="space-y-6">
      {/* Title & Guidance */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
          <FileCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>10단계: 최종 기획 청사진 확인 & AI 프롬프트 완성!</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
          내가 기획한 웹앱의 멋진 설계서를 확인해 보세요
        </h3>
        <p className="text-sm text-slate-600">
          지금까지 입력한 9가지 단계가 깔끔하게 정리되었습니다. 하단의 생성 버튼을 누르면 구글 AI 스튜디오(Google AI Studio)에 바로 복사해 넣을 수 있는 전문가 수준의 프롬프트가 완성됩니다!
        </p>
      </div>

      {/* Dedicated Google AI Studio Optimized Notice */}
      <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-100/50 to-orange-100/40 border border-amber-300 shadow-2xs">
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-base flex-shrink-0 shadow-xs">
          AI
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-black text-slate-800">
              구글 AI 스튜디오(Google AI Studio) 전용 프롬프트 생성
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 border border-amber-300">
              자동 최적화
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            구글 AI 스튜디오에서 코드를 생성할 때 필요한 마스코트, 화면 플로우, 세부 동작 규칙이 빈틈없이 최적화되어 포함됩니다.
          </p>
        </div>
      </div>

      {/* Blueprint Card (Summary of the 9 steps) */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-50/80 via-white to-amber-100/40 border-2 border-amber-200 shadow-md space-y-6 relative overflow-hidden">
        {/* Background Decorative Stamp */}
        <div className="absolute -right-6 -bottom-6 text-9xl opacity-10 pointer-events-none select-none">
          {mascot?.emoji || '✨'}
        </div>

        {/* Header of Blueprint */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/80">
          <div className="flex items-center gap-3">
            <div className="text-4xl sm:text-5xl p-2 rounded-2xl bg-white border border-amber-200 shadow-xs">
              {mascot?.emoji || '✨'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-200/70 px-2 py-0.5 rounded-md">
                  Web App Blueprint
                </span>
                <span className="text-xs font-bold text-slate-500">
                  마스코트: {mascot ? `${mascot.name} (${mascot.animal})` : '미선택'}
                </span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {appName}
              </h4>
              <p className="text-xs sm:text-sm text-amber-900 font-bold">
                "{slogan}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-100 text-emerald-900 text-xs font-extrabold border border-emerald-200 self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>기획 완성도 100%</span>
          </div>
        </div>

        {/* Blueprint Specifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          {/* Box 1: Idea & Purpose */}
          <div className="p-4 rounded-2xl bg-white/90 border border-amber-100 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-700 flex items-center gap-1">
                💡 1~2단계: 아이디어 & 목적
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(1)}
                className="text-[11px] font-bold text-amber-600 hover:underline cursor-pointer"
              >
                수정
              </button>
            </div>
            <p className="text-slate-800 font-medium">
              {blueprint.ideaText || blueprint.selectedIdeaChip || '아이디어 입력됨'}
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              {blueprint.purposes.map((p) => (
                <span
                  key={p}
                  className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200"
                >
                  {p}
                </span>
              ))}
              {blueprint.customPurpose && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[11px] font-bold">
                  {blueprint.customPurpose}
                </span>
              )}
            </div>
          </div>

          {/* Box 2: Target Users */}
          <div className="p-4 rounded-2xl bg-white/90 border border-amber-100 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-700 flex items-center gap-1">
                👥 3단계: 대상 사용자
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(3)}
                className="text-[11px] font-bold text-amber-600 hover:underline cursor-pointer"
              >
                수정
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {blueprint.targetUsers.length > 0 ? (
                blueprint.targetUsers.map((u) => (
                  <span
                    key={u}
                    className="px-2.5 py-1 rounded-xl bg-sky-50 text-sky-800 text-xs font-bold border border-sky-200"
                  >
                    {u}
                  </span>
                ))
              ) : (
                <span className="text-slate-400">학생, 친구들</span>
              )}
              {blueprint.customTargetUser && (
                <span className="px-2.5 py-1 rounded-xl bg-sky-100 text-sky-900 text-xs font-bold">
                  {blueprint.customTargetUser}
                </span>
              )}
            </div>
          </div>

          {/* Box 3: Features & Rules */}
          <div className="p-4 rounded-2xl bg-white/90 border border-amber-100 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-700 flex items-center gap-1">
                ⚡ 4~5단계: 핵심 기능 ({blueprint.features.length}개)
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(4)}
                className="text-[11px] font-bold text-amber-600 hover:underline cursor-pointer"
              >
                수정
              </button>
            </div>
            <p className="text-slate-800 font-medium line-clamp-2">
              {featureNames || '기능 미선택'}
            </p>
            <span className="text-[11px] text-amber-700 font-bold block">
              ✓ 각 기능별 세부 규칙 {Object.keys(blueprint.featureDetails).length}개 설정 완료
            </span>
          </div>

          {/* Box 4: Screens & Design */}
          <div className="p-4 rounded-2xl bg-white/90 border border-amber-100 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-700 flex items-center gap-1">
                🎨 6~7단계: 화면 & 디자인
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(7)}
                className="text-[11px] font-bold text-amber-600 hover:underline cursor-pointer"
              >
                수정
              </button>
            </div>
            <div className="text-xs text-slate-700 space-y-1">
              <div>
                <span className="font-bold text-slate-500">스타일:</span>{' '}
                {blueprint.designStyle || '기본 스타일'} / {blueprint.themeColor || '기본 테마'}
              </div>
              <div className="truncate">
                <span className="font-bold text-slate-500">화면 구성:</span>{' '}
                {blueprint.screens.length > 0 ? blueprint.screens.join(', ') : '자유 화면 구성'}
              </div>
            </div>
          </div>
        </div>

        {/* Killer Idea Highlight Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-200/70 to-amber-200/70 border border-amber-300 flex items-start gap-3">
          <div className="text-2xl mt-0.5">🌟</div>
          <div>
            <span className="text-xs font-extrabold text-amber-950 uppercase tracking-wide block">
              학생 기획자의 특별한 킬러 아이디어
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
              "{blueprint.specialIdea || blueprint.selectedSpecialIdeaChip || '아이디어를 직접 입력해 보세요!'}"
            </p>
          </div>
        </div>
      </div>

      {/* Big Master Prompt Generation Trigger */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onGeneratePrompt}
          disabled={isGeneratingPrompt}
          className="w-full py-4 sm:py-5 px-6 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-lg sm:text-xl shadow-xl shadow-amber-500/25 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-75"
        >
          {isGeneratingPrompt ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Gemini AI가 정밀 개발 프롬프트를 작성 중입니다...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 fill-white" />
              <span>✨ AI 웹앱 제작 프롬프트 만들기</span>
              <ArrowRight className="w-6 h-6" />
            </>
          )}
        </button>
        <p className="text-center text-xs text-slate-500 mt-2 font-medium">
          * Gemini 3.8 Flash 연동 또는 내장 스마트 생성 엔진으로 1~2초 만에 완벽한 AI 프롬프트를 만들어 드립니다.
        </p>
      </div>
    </div>
  );
};
