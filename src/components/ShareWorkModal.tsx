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
  Settings,
  ExternalLink,
  Sparkles,
  Link,
  UserCheck,
  AlertCircle
} from 'lucide-react';

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

const APPS_SCRIPT_CODE = `function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    // A열: 번호, B열: 공유링크 추가
    sheet.appendRow([data.number || data.studentNumber, data.link || data.shareUrl]);
    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

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
  const [showSubmissionsList, setShowSubmissionsList] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedTsv, setCopiedTsv] = useState(false);
  const [customScriptUrl, setCustomScriptUrl] = useState('');
  const [submissions, setSubmissions] = useState<LocalSubmission[]>([]);

  // Load custom script URL and local submissions from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUrl = localStorage.getItem('ideaspark_sheet_webapp_url') || '';
      setCustomScriptUrl(savedUrl);

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

  const handleSaveScriptUrl = (url: string) => {
    setCustomScriptUrl(url);
    localStorage.setItem('ideaspark_sheet_webapp_url', url.trim());
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

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

    try {
      const payload = {
        studentNumber: studentNumber.trim(),
        shareUrl: shareUrl.trim(),
        studentName: studentName.trim() || undefined,
        appName: defaultAppName || undefined,
        customScriptUrl: customScriptUrl.trim() || undefined,
      };

      const res = await fetch('/api/share-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      const newSubmission: LocalSubmission = {
        id: String(Date.now()),
        studentNumber: studentNumber.trim(),
        shareUrl: shareUrl.trim(),
        studentName: studentName.trim() || undefined,
        appName: defaultAppName || undefined,
        submittedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        synced: Boolean(data.syncedToGoogleSheet),
      };

      const updatedList = [newSubmission, ...submissions];
      setSubmissions(updatedList);
      localStorage.setItem('ideaspark_local_submissions', JSON.stringify(updatedList));

      if (data.syncedToGoogleSheet) {
        setSubmitStatus({
          type: 'success',
          message: `✨ ${studentNumber}번 학생의 작품이 [학생작품공유] 구글 시트에 바로 등록되었습니다!`,
        });
        setShareUrl('');
      } else {
        setSubmitStatus({
          type: 'info',
          message: `등록되었습니다! (번호: ${studentNumber}, 구글 AI 스튜디오 공유링크 기록 완료)`,
          details: data.hasScriptConfigured
            ? '시트 연동 상태를 확인해 주세요.'
            : '하단 [구글 시트 실시간 자동 연동 방법]을 설정하시면 학생이 제출할 때마다 시트에 1초 만에 자동 삽입됩니다.',
        });
      }
    } catch {
      setSubmitStatus({
        type: 'error',
        message: '제출 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      });
    } finally {
      setIsSubmitting(false);
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
                구글 AI 스튜디오로 만든 내 작품 링크를 시트에 제출해요
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
              className={`p-3.5 rounded-2xl border flex items-start gap-2.5 ${
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

          {/* Sheet Preview Card matching User Image 1 */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  구글 시트: <span className="text-emerald-700">학생작품공유</span>
                </span>
                <span className="text-[11px] text-slate-500 block">
                  A열(번호)과 B열(공유링크) 위치에 정확히 삽입됩니다
                </span>
              </div>
            </div>

            {submissions.length > 0 && (
              <button
                type="button"
                onClick={handleCopyTsv}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                title="시트의 A2 셀에 바로 붙여넣을 수 있도록 전체 복사"
              >
                <Copy className="w-3 h-3" />
                {copiedTsv ? '복사 완료!' : `제출 목록 (${submissions.length}) 시트 복사`}
              </button>
            )}
          </div>

          {/* Teacher Guide Toggle */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="w-full px-4 py-3 text-left font-bold text-xs sm:text-sm text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-600" />
                구글 시트 실시간 자동 연동 방법 (선생님 안내)
              </span>
              {showGuide ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showGuide && (
              <div className="p-4 pt-1 text-xs text-slate-600 space-y-3.5 border-t border-slate-200 bg-white">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      <strong>학생작품공유</strong> 구글 시트 상단 메뉴에서{' '}
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 font-semibold text-slate-800">
                        확장 프로그램 &gt; Apps Script
                      </span>
                      를 클릭합니다.
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <div className="flex-1">
                      <p>
                        기존 내용을 지우고 아래 스크립트를 붙여넣은 후 저장(💾)합니다:
                      </p>
                      <div className="mt-1.5 relative">
                        <pre className="p-3 bg-slate-900 text-emerald-300 font-mono text-[11px] rounded-xl overflow-x-auto leading-relaxed">
                          {APPS_SCRIPT_CODE}
                        </pre>
                        <button
                          type="button"
                          onClick={handleCopyCode}
                          className="absolute top-2 right-2 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          {copiedCode ? '복사됨!' : '코드 복사'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <p>
                      우측 상단 <strong>[배포] &gt; [새 배포]</strong>를 누르고 유형을{' '}
                      <strong>웹 앱</strong>으로 선택한 후, 액세스 권한을{' '}
                      <span className="text-emerald-700 font-bold underline">모든 사용자(Anyone)</span>
                      로 지정하고 [배포]를 누릅니다.
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      4
                    </span>
                    <div className="flex-1">
                      <p>생성된 <strong>웹 앱 URL</strong>을 아래에 입력해 두면 완료됩니다:</p>
                      <div className="mt-1.5 flex gap-2">
                        <input
                          type="url"
                          value={customScriptUrl}
                          onChange={(e) => handleSaveScriptUrl(e.target.value)}
                          placeholder="https://script.google.com/macros/s/.../exec"
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveScriptUrl(customScriptUrl)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                        >
                          저장
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        * 설정 후에는 학생들이 제출할 때마다 [학생작품공유] 구글 시트의 번호와 공유링크가 실시간으로 자동 기재됩니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>제출된 링크는 구글 시트에 안전하게 전송됩니다.</span>
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
