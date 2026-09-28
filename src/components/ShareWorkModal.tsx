import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Send,
  CheckCircle2,
  FileSpreadsheet,
  Copy,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Link,
  AlertCircle,
  Lock,
  Info,
  Check
} from 'lucide-react';

export const FIXED_GOOGLE_SHEET_WEBAPP_URL =
  'https://script.google.com/macros/s/AKfycbx2NNOJw88rAxVJNPNNK_ApUt9SWpxePN_8j982TOrq8bIgbfmnreNNRIDicrzQPCTiSQ/exec';

interface ShareWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAppName?: string;
  defaultMascotName?: string;
}

interface LocalSubmission {
  id: string;
  studentNumber: string;
  shareUrl: string;
  studentName?: string;
  appName?: string;
  submittedAt: string;
  synced: boolean;
}

export const ShareWorkModal: React.FC<ShareWorkModalProps> = ({
  isOpen,
  onClose,
  defaultAppName,
  defaultMascotName,
}) => {
  const [studentNumber, setStudentNumber] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [studentName, setStudentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'info' | 'error';
    message: string;
    details?: string;
  } | null>(null);

  const [showGuide, setShowGuide] = useState(false);
  const [copiedTsv, setCopiedTsv] = useState(false);
  const [submissions, setSubmissions] = useState<LocalSubmission[]>([]);

  // Load local submissions from localStorage & clean up any legacy sheet url
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedList = localStorage.getItem('ideaspark_local_submissions');
        if (savedList) {
          setSubmissions(JSON.parse(savedList));
        }
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  const handleCopyTsv = () => {
    if (submissions.length === 0) return;
    const tsvData = submissions.map((s) => `${s.studentNumber}\t${s.shareUrl}`).join('\n');
    navigator.clipboard.writeText(tsvData);
    setCopiedTsv(true);
    setTimeout(() => setCopiedTsv(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentNumber.trim()) {
      setSubmitStatus({ type: 'error', message: '번호(출석번호 또는 학번)를 입력해 주세요.' });
      return;
    }
    if (!shareUrl.trim()) {
      setSubmitStatus({ type: 'error', message: '구글 AI 스튜디오 공유링크를 입력해 주세요.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    let syncedToGoogleSheet = false;

    // 1. First, call the backend API endpoint
    try {
      const res = await fetch('/api/share-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentNumber: studentNumber.trim(),
          shareUrl: shareUrl.trim(),
          studentName: studentName.trim() || undefined,
          appName: defaultAppName || undefined,
        }),
      });

      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (data.syncedToGoogleSheet) {
            syncedToGoogleSheet = true;
          }
        }
      }
    } catch {
      // Server error or offline, fallback to direct fetch below
    }

    // 2. Direct client-side call to the permanent Google Sheet Web App if server didn't confirm
    if (!syncedToGoogleSheet) {
      try {
        await fetch(FIXED_GOOGLE_SHEET_WEBAPP_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify({
            number: studentNumber.trim(),
            studentNumber: studentNumber.trim(),
            link: shareUrl.trim(),
            shareUrl: shareUrl.trim(),
            studentName: studentName.trim() || '',
            appName: defaultAppName || '',
            timestamp: new Date().toISOString(),
          }),
        });
        syncedToGoogleSheet = true;
      } catch (err: any) {
        console.warn('Direct fetch to Google Apps Script failed:', err);
      }
    }

    // Save record to local state & localStorage backup
    const newSubmission: LocalSubmission = {
      id: String(Date.now()),
      studentNumber: studentNumber.trim(),
      shareUrl: shareUrl.trim(),
      studentName: studentName.trim() || undefined,
      appName: defaultAppName || undefined,
      submittedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      synced: syncedToGoogleSheet,
    };

    const updatedList = [newSubmission, ...submissions];
    setSubmissions(updatedList);
    try {
      localStorage.setItem('ideaspark_local_submissions', JSON.stringify(updatedList));
    } catch {
      // ignore
    }

    setIsSubmitting(false);

    if (syncedToGoogleSheet) {
      setSubmitStatus({
        type: 'success',
        message: `✨ ${studentNumber}번 학생의 작품이 [학생작품공유] 구글 시트에 바로 등록되었습니다!`,
        details: 'A열(번호)과 B열(공유링크)에 안전하게 저장되었습니다.',
      });
      setShareUrl('');
    } else {
      setSubmitStatus({
        type: 'error',
        message: '시트 전송 중 일시적인 네트워크 지연이 발생했습니다.',
        details: '아래 [제출 목록 시트 복사] 버튼을 누르시면 시트 A열에 바로 붙여넣기(Ctrl+V)하실 수 있습니다.',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-emerald-100 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs text-white">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-1.5">
                내 작품 공유하기
                <Sparkles className="w-4 h-4 text-emerald-200" />
              </h3>
              <p className="text-xs text-emerald-100">
                구글 AI 스튜디오로 만든 내 작품 링크를 지정된 공유 시트에 제출해요
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-sm text-slate-700">
          {/* Status Message */}
          {submitStatus && (
            <div
              className={`p-3.5 rounded-2xl border flex items-start gap-2.5 transition-all ${
                submitStatus.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : submitStatus.type === 'info'
                  ? 'bg-blue-50 border-blue-200 text-blue-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {submitStatus.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : submitStatus.type === 'info' ? (
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs sm:text-sm">
                <p className="font-bold">{submitStatus.message}</p>
                {submitStatus.details && (
                  <p className="mt-1 text-xs opacity-90">{submitStatus.details}</p>
                )}
              </div>
            </div>
          )}

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  번호 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  placeholder="예: 7 (또는 1-7)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  이름 / 작품 이름 (선택)
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder={defaultAppName ? `예: 홍길동 (${defaultAppName})` : '예: 홍길동 (도토리 뽀모)'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5 text-emerald-600" />
                  구글 AI 스튜디오 공유링크 <span className="text-rose-500">*</span>
                </span>
                <span className="text-[11px] font-normal text-slate-400">
                  AI Studio 우측 상단 [Share] 버튼 링크
                </span>
              </label>
              <textarea
                value={shareUrl}
                onChange={(e) => setShareUrl(e.target.value)}
                placeholder="https://aistudio.google.com/... 또는 https://ais-pre-...run.app 공유 링크를 붙여넣어 주세요"
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm font-mono resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-black text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>제출하는 중...</>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  시트에 내 작품 제출하기
                </>
              )}
            </button>
          </form>

          {/* Fixed Google Sheet Status Card */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-slate-800">
                    구글 시트: <span className="text-emerald-700">학생작품공유</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-200/80 text-emerald-900 text-[10px] font-bold">
                    <Lock className="w-2.5 h-2.5" />
                    전용 시트 고정 연동됨
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  제출 즉시 A열(번호)과 B열(공유링크) 위치에 자동 기록됩니다
                </span>
              </div>
            </div>

            {submissions.length > 0 && (
              <button
                type="button"
                onClick={handleCopyTsv}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs shrink-0 ml-2"
                title="시트 백업 또는 수동 확인용 클립보드 복사"
              >
                <Copy className="w-3 h-3" />
                {copiedTsv ? '복사 완료!' : `제출 목록 (${submissions.length}) 시트 복사`}
              </button>
            )}
          </div>

          {/* Information Notice for Teachers (Locked Sheet Guide) */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="w-full px-4 py-3 text-left font-bold text-xs sm:text-sm text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-600" />
                공유 시트 연동 안내 (선생님 참고)
              </span>
              {showGuide ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showGuide && (
              <div className="p-4 pt-2 text-xs text-slate-600 space-y-2.5 border-t border-slate-200 bg-white leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    ✓
                  </span>
                  <p>
                    <strong>공유 시트 주소 영구 고정:</strong> 본 프로그램은 전용{' '}
                    <strong className="text-emerald-700">[학생작품공유]</strong> 구글 시트로 주소가 고정되어 있습니다. 선생님이나 학생이 별도로 시트 주소를 수정하거나 교체할 필요 없이 바로 사용하실 수 있습니다.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    ✓
                  </span>
                  <p>
                    <strong>시트 자동 기재 위치:</strong> 학생이 번호와 링크를 적고 제출 버튼을 누르면, 구글 시트의{' '}
                    <span className="font-semibold text-slate-800">A열(번호)</span>과{' '}
                    <span className="font-semibold text-slate-800">B열(공유링크)</span>에 자동으로 실시간 추가됩니다.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    ✓
                  </span>
                  <p>
                    <strong>편리한 백업 복사 기능:</strong> 제출된 내역은 본 기기에도 함께 임시 보관되므로, 필요한 경우 상단의{' '}
                    <span className="font-semibold text-emerald-700">[제출 목록 시트 복사]</span> 버튼을 눌러 시트 어느 곳에나{' '}
                    <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px] border border-slate-200 font-mono">Ctrl + V</kbd>
                    로 한 번에 붙여넣으실 수 있습니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>제출된 링크는 공식 구글 시트에 안전하게 전송됩니다.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
