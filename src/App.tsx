/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Save, Sparkles, Check } from 'lucide-react';
import { AppBlueprint, MascotConfig } from './types';
import { MASCOTS, COLOR_PALETTES, DESIGN_STYLES } from './data/wizardData';
import { Header } from './components/Header';
import { StepProgressBar, WIZARD_STEPS } from './components/StepProgressBar';
import { Step1Idea } from './components/steps/Step1Idea';
import { Step2Purpose } from './components/steps/Step2Purpose';
import { Step3TargetUsers } from './components/steps/Step3TargetUsers';
import { Step4Features } from './components/steps/Step4Features';
import { Step5FeatureDetails } from './components/steps/Step5FeatureDetails';
import { Step6Screens } from './components/steps/Step6Screens';
import { Step7DesignMascot } from './components/steps/Step7DesignMascot';
import { Step8SpecialIdea } from './components/steps/Step8SpecialIdea';
import { Step9AppName } from './components/steps/Step9AppName';
import { Step10Blueprint } from './components/steps/Step10Blueprint';
import { PromptResultView } from './components/PromptResultView';
import { RevisionModal } from './components/RevisionModal';
import { HelpGuideModal } from './components/HelpGuideModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { ShareWorkModal } from './components/ShareWorkModal';
import { Toast, ToastMessage } from './components/Toast';
import { generateFullAppPrompt } from './utils/gemini';

const STORAGE_KEY = 'student_app_blueprint_v3';
const STEP_STORAGE_KEY = 'student_app_current_step_v3';

const INITIAL_BLUEPRINT: AppBlueprint = {
  ideaText: '',
  selectedIdeaChip: '',
  purposes: [],
  customPurpose: '',
  targetUsers: [],
  customTargetUser: '',
  features: [],
  featureDetails: {},
  screens: [],
  customScreens: [],
  aiScreenSuggestions: [],
  screenFlowNotes: '',
  designStyle: '',
  themeColor: '',
  mascot: null,
  customDesignNotes: '',
  specialIdea: '',
  selectedSpecialIdeaChip: '',
  appName: '',
  appSlogan: '',
  aiNameSuggestions: [],
  targetAiTool: 'general',
  generatedPrompt: '',
  isCustomizedPrompt: false,
};

export default function App() {
  const [blueprint, setBlueprint] = useState<AppBlueprint>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_BLUEPRINT, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to restore blueprint from localStorage', e);
    }
    return INITIAL_BLUEPRINT;
  });

  const [currentStep, setCurrentStep] = useState<number>(() => {
    try {
      const savedStep = localStorage.getItem(STEP_STORAGE_KEY);
      if (savedStep) {
        const parsed = parseInt(savedStep, 10);
        if (parsed >= 1 && parsed <= 10) return parsed;
      }
    } catch {}
    return 1;
  });

  const [maxStepReached, setMaxStepReached] = useState<number>(() => {
    try {
      const savedMax = localStorage.getItem('student_webapp_max_step');
      const savedStep = localStorage.getItem(STEP_STORAGE_KEY);
      const parsedStep = savedStep ? parseInt(savedStep, 10) : 1;
      const parsedMax = savedMax ? parseInt(savedMax, 10) : parsedStep;
      const savedBp = localStorage.getItem(STORAGE_KEY);
      if (savedBp) {
        const parsedBp = JSON.parse(savedBp);
        if (parsedBp.generatedPrompt || parsedBp.appName) {
          return 10;
        }
      }
      return Math.max(1, isNaN(parsedMax) ? 1 : parsedMax);
    } catch {
      return 1;
    }
  });

  useEffect(() => {
    setMaxStepReached((prev) => {
      const next = Math.max(prev, currentStep);
      try {
        localStorage.setItem('student_webapp_max_step', next.toString());
      } catch {}
      return next;
    });
  }, [currentStep]);

  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [promptSource, setPromptSource] = useState<'gemini' | 'fallback'>('fallback');
  const [showResultView, setShowResultView] = useState(false);

  // Modals
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Save to localStorage
  const handleSaveToStorage = useCallback((manual = false) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blueprint));
      localStorage.setItem(STEP_STORAGE_KEY, currentStep.toString());
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
      setLastSavedAt(timeStr);
      if (manual) {
        addToast('현재 기획 내용이 브라우저에 임시 저장되었습니다!');
      }
    } catch (err) {
      console.warn('Storage save error:', err);
    }
  }, [blueprint, currentStep, addToast]);

  // Auto-save on blueprint change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSaveToStorage(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [blueprint, handleSaveToStorage]);

  // Reset all
  const handleConfirmReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STEP_STORAGE_KEY);
    localStorage.removeItem('student_webapp_max_step');
    setBlueprint(INITIAL_BLUEPRINT);
    setCurrentStep(1);
    setMaxStepReached(1);
    setShowResultView(false);
    setIsResetOpen(false);
    addToast('기획서가 새로 초기화되었습니다.', 'info');
  };

  // Next / Previous navigation
  const handleNextStep = () => {
    if (currentStep < 10) {
      // Step 1 check
      if (currentStep === 1 && !blueprint.ideaText.trim() && !blueprint.selectedIdeaChip) {
        addToast('아이디어를 직접 적거나 8가지 주제 칩 중 하나를 골라주세요!', 'info');
      }
      // Step 4 check
      if (currentStep === 4 && blueprint.features.length === 0) {
        addToast('앱에 들어갈 핵심 기능을 골라주면 더 완성도 높은 기획서가 돼요!', 'info');
      }

      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToStep = (stepId: number) => {
    setCurrentStep(stepId);
    setShowResultView(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Master Prompt Generator
  const handleGeneratePrompt = async () => {
    setIsGeneratingPrompt(true);
    try {
      const result = await generateFullAppPrompt(blueprint);
      setBlueprint((prev) => ({
        ...prev,
        generatedPrompt: result.prompt,
        promptGeneratedAt: new Date().toISOString(),
      }));
      setPromptSource(result.source);
      setShowResultView(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (result.source === 'gemini') {
        addToast('Gemini AI가 고품질 코딩 지시서를 완성했습니다!', 'success');
      } else {
        addToast('스마트 템플릿 엔진으로 개발 프롬프트를 완성했습니다!', 'success');
      }
    } catch {
      addToast('프롬프트 생성 중 문제가 발생하여 오프라인 템플릿을 생성했습니다.', 'info');
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/30 text-slate-800 font-sans">
      {/* Top Header */}
      <Header
        currentStep={currentStep}
        totalSteps={WIZARD_STEPS.length}
        lastSavedAt={lastSavedAt}
        mascot={blueprint.mascot}
        onReset={() => setIsResetOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenShareModal={() => setIsShareOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {showResultView && blueprint.generatedPrompt ? (
          /* Prompt Result & Editor View */
          <PromptResultView
            prompt={blueprint.generatedPrompt}
            source={promptSource}
            blueprint={blueprint}
            onCopy={() => addToast('클립보드에 복사되었습니다! v0나 Bolt에 붙여넣어 보세요.')}
            onRegenerate={handleGeneratePrompt}
            onOpenRevisionModal={() => setIsRevisionOpen(true)}
            onBackToWizard={() => setShowResultView(false)}
            onOpenShareModal={() => setIsShareOpen(true)}
            onUpdatePromptText={(newText) => {
              setBlueprint((prev) => ({
                ...prev,
                generatedPrompt: newText,
                isCustomizedPrompt: true,
              }));
              addToast('수정된 프롬프트가 저장되었습니다.');
            }}
          />
        ) : (
          /* 10-Step Wizard Container */
          <div className="space-y-6">
            {/* Step Progress Bar */}
            <StepProgressBar
              currentStep={currentStep}
              maxStepReached={maxStepReached}
              onStepClick={handleJumpToStep}
            />

            {/* Current Step Content Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-8 border border-amber-100 shadow-sm min-h-[460px]">
              {currentStep === 1 && (
                <Step1Idea
                  ideaText={blueprint.ideaText}
                  selectedIdeaChip={blueprint.selectedIdeaChip}
                  mascot={blueprint.mascot}
                  onChangeIdea={(text) =>
                    setBlueprint((prev) => ({ ...prev, ideaText: text }))
                  }
                  onSelectChip={(title, desc, fullText) => {
                    const nextText = fullText || `${title}: ${desc}`;
                    setBlueprint((prev) => ({
                      ...prev,
                      selectedIdeaChip: title,
                      ideaText: nextText,
                    }));
                    addToast(`💡 '${title}' 아이디어가 입력창에 쏙 들어갔어요!`);
                  }}
                />
              )}

              {currentStep === 2 && (
                <Step2Purpose
                  purposes={blueprint.purposes}
                  customPurpose={blueprint.customPurpose}
                  onTogglePurpose={(label) =>
                    setBlueprint((prev) => {
                      const exists = prev.purposes.includes(label);
                      return {
                        ...prev,
                        purposes: exists
                          ? prev.purposes.filter((p) => p !== label)
                          : [...prev.purposes, label],
                      };
                    })
                  }
                  onSetCustomPurpose={(text) =>
                    setBlueprint((prev) => ({ ...prev, customPurpose: text }))
                  }
                />
              )}

              {currentStep === 3 && (
                <Step3TargetUsers
                  targetUsers={blueprint.targetUsers}
                  customTargetUser={blueprint.customTargetUser}
                  onToggleUser={(label) =>
                    setBlueprint((prev) => {
                      const exists = prev.targetUsers.includes(label);
                      return {
                        ...prev,
                        targetUsers: exists
                          ? prev.targetUsers.filter((u) => u !== label)
                          : [...prev.targetUsers, label],
                      };
                    })
                  }
                  onSetCustomUser={(text) =>
                    setBlueprint((prev) => ({ ...prev, customTargetUser: text }))
                  }
                />
              )}

              {currentStep === 4 && (
                <Step4Features
                  selectedFeatures={blueprint.features}
                  onToggleFeature={(featId) =>
                    setBlueprint((prev) => {
                      const exists = prev.features.includes(featId);
                      return {
                        ...prev,
                        features: exists
                          ? prev.features.filter((f) => f !== featId)
                          : [...prev.features, featId],
                      };
                    })
                  }
                />
              )}

              {currentStep === 5 && (
                <Step5FeatureDetails
                  selectedFeatures={blueprint.features}
                  featureDetails={blueprint.featureDetails}
                  onUpdateDetail={(featId, questionKey, value) =>
                    setBlueprint((prev) => ({
                      ...prev,
                      featureDetails: {
                        ...prev.featureDetails,
                        [featId]: {
                          ...(prev.featureDetails[featId] || {}),
                          [questionKey]: value,
                        },
                      },
                    }))
                  }
                  onGoToStep4={() => setCurrentStep(4)}
                />
              )}

              {currentStep === 6 && (
                <Step6Screens
                  screens={blueprint.screens}
                  screenFlowNotes={blueprint.screenFlowNotes}
                  blueprint={blueprint}
                  onToggleScreen={(screenName) =>
                    setBlueprint((prev) => {
                      const exists = prev.screens.includes(screenName);
                      return {
                        ...prev,
                        screens: exists
                          ? prev.screens.filter((s) => s !== screenName)
                          : [...prev.screens, screenName],
                      };
                    })
                  }
                  onAddCustomScreen={(screenName) =>
                    setBlueprint((prev) => ({
                      ...prev,
                      screens: [...prev.screens, screenName],
                    }))
                  }
                  onChangeNotes={(notes) =>
                    setBlueprint((prev) => ({ ...prev, screenFlowNotes: notes }))
                  }
                  onSetAISuggestions={(suggestions) =>
                    setBlueprint((prev) => ({
                      ...prev,
                      aiScreenSuggestions: suggestions,
                    }))
                  }
                />
              )}

              {currentStep === 7 && (
                <Step7DesignMascot
                  designStyle={blueprint.designStyle}
                  themeColor={blueprint.themeColor}
                  mascot={blueprint.mascot}
                  customDesignNotes={blueprint.customDesignNotes}
                  onSelectStyle={(style) =>
                    setBlueprint((prev) => ({ ...prev, designStyle: style }))
                  }
                  onSelectColor={(color) =>
                    setBlueprint((prev) => ({ ...prev, themeColor: color }))
                  }
                  onSelectMascot={(m) =>
                    setBlueprint((prev) => ({ ...prev, mascot: m }))
                  }
                  onChangeMascotPhrase={(phrase) =>
                    setBlueprint((prev) => ({
                      ...prev,
                      mascot: prev.mascot ? { ...prev.mascot, cheerPhrase: phrase } : null,
                    }))
                  }
                  onChangeCustomNotes={(notes) =>
                    setBlueprint((prev) => ({ ...prev, customDesignNotes: notes }))
                  }
                />
              )}

              {currentStep === 8 && (
                <Step8SpecialIdea
                  specialIdea={blueprint.specialIdea}
                  selectedSpecialIdeaChip={blueprint.selectedSpecialIdeaChip}
                  mascot={blueprint.mascot}
                  onChangeSpecialIdea={(text) =>
                    setBlueprint((prev) => ({ ...prev, specialIdea: text }))
                  }
                  onSelectSpecialChip={(chip) => {
                    setBlueprint((prev) => ({
                      ...prev,
                      selectedSpecialIdeaChip: chip,
                      specialIdea: chip,
                    }));
                    addToast(`🌟 '${chip}' 아이디어가 입력창에 쏙 들어갔어요!`);
                  }}
                />
              )}

              {currentStep === 9 && (
                <Step9AppName
                  appName={blueprint.appName}
                  appSlogan={blueprint.appSlogan}
                  aiNameSuggestions={blueprint.aiNameSuggestions}
                  blueprint={blueprint}
                  onChangeName={(name) =>
                    setBlueprint((prev) => ({ ...prev, appName: name }))
                  }
                  onChangeSlogan={(slogan) =>
                    setBlueprint((prev) => ({ ...prev, appSlogan: slogan }))
                  }
                  onSetAISuggestions={(suggestions) =>
                    setBlueprint((prev) => ({
                      ...prev,
                      aiNameSuggestions: suggestions,
                    }))
                  }
                />
              )}

              {currentStep === 10 && (
                <Step10Blueprint
                  blueprint={blueprint}
                  isGeneratingPrompt={isGeneratingPrompt}
                  onSelectTargetTool={(tool) =>
                    setBlueprint((prev) => ({ ...prev, targetAiTool: tool }))
                  }
                  onGeneratePrompt={handleGeneratePrompt}
                  onJumpToStep={handleJumpToStep}
                />
              )}
            </div>

            {/* Bottom Wizard Navigation Buttons */}
            <div className="flex items-center justify-between gap-4 pt-2">
              {/* Previous Button */}
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors shadow-2xs active:scale-95 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>이전 단계</span>
                </button>
              ) : (
                <div />
              )}

              {/* Next Button or View Prompt Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveToStorage(true)}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 font-bold text-sm hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4 text-amber-600" />
                  <span>임시저장</span>
                </button>

                {currentStep < 10 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm sm:text-base shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <span>다음 단계</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleGeneratePrompt}
                    disabled={isGeneratingPrompt}
                    className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm sm:text-base shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-75"
                  >
                    <Sparkles className="w-4 h-4 fill-white" />
                    <span>프롬프트 생성하기</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-amber-100 py-6 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-600">
          IdeaSpark — 학생을 위한 쉽고 재미있는 웹앱 기획 & AI 코딩 프롬프트 스튜디오
        </p>
        <p className="mt-1 text-slate-400">
          v0.dev, Bolt.new, Lovable.dev, Claude Artifacts 지원 | Gemini 3.8 Flash 연동
        </p>
      </footer>

      {/* Modals & Toasts */}
      <RevisionModal
        isOpen={isRevisionOpen}
        blueprint={blueprint}
        onClose={() => setIsRevisionOpen(false)}
        onShowToast={(msg) => addToast(msg, 'success')}
      />

      <HelpGuideModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <ResetConfirmModal
        isOpen={isResetOpen}
        onConfirm={handleConfirmReset}
        onClose={() => setIsResetOpen(false)}
      />

      <ShareWorkModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        defaultAppName={blueprint.appName}
        defaultMascotName={blueprint.mascot?.name}
      />

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
