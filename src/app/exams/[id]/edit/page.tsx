'use client';

import { adminApi } from '@/lib/api/admin';
import 'katex/dist/katex.min.css';
import { ArrowLeft, Check, Copy, Edit, ImageIcon, Save, X } from "lucide-react";
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';

const processContent = (content: any) => {
  if (content === null || content === undefined) return '';
  let strContent = String(content).trim();
  if (/^\d+\.$/.test(strContent)) {
    return strContent.replace('.', '\\.');
  }
  return strContent
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$')
    .replace(/\\\[/g, '$$')
    .replace(/\\\]/g, '$$');
};

export default function EditExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [examTitle, setExamTitle] = useState('');
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [editingContentId, setEditingContentId] = useState<number | null>(null);
  const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);
  const [editingShortAnswerId, setEditingShortAnswerId] = useState<number | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [copiedImageId, setCopiedImageId] = useState<number | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  useEffect(() => {
    if (examId) {
      loadQuestions();
      loadImages();
    }
  }, [examId]);

  const loadImages = async () => {
    try {
      setLoadingImages(true);
      const response = await adminApi.getImagesByExamId(examId);
      if (Array.isArray(response)) {
        setImages(response);
      } else {
        setImages(response.data || []);
      }
    } catch (error) {
      console.error("Failed to load images", error);
    } finally {
      setLoadingImages(false);
    }
  };

  const copyToClipboard = (url: string, id: number) => {
    navigator.clipboard.writeText(`![](${url})`);
    setCopiedImageId(id);
    setTimeout(() => setCopiedImageId(null), 2000);
  };

  const handleSaveQuestionContent = async (questionId: number, content: string) => {
    try {
      setSaving(true);
      await adminApi.updateQuestion(questionId, { content });

      setQuestions(prev => prev.map(q =>
        q.id === questionId ? { ...q, content } : q
      ));
      setEditingContentId(null);
    } catch (error) {
      console.error("Failed to save question content", error);
      alert("Failed to save question content");
    } finally {
      setSaving(false);
    }
  };

  const loadQuestions = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await adminApi.getQuestionsByExamId(examId);
      const questionsData = response.data || [];
      console.log('Loaded questions:', questionsData);
      setQuestions(questionsData);

      // Get exam title from first question if available
      if (questionsData.length > 0 && questionsData[0].exam) {
        setExamTitle(questionsData[0].exam.title || '');
      }
    } catch (error) {
      console.error("Failed to load questions", error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleSaveExplanation = async (questionId: number, explanation: string) => {
    try {
      setSaving(true);
      await adminApi.updateQuestion(questionId, { explanation });

      // Update local state
      setQuestions(prev => prev.map(q =>
        q.id === questionId ? { ...q, explanation } : q
      ));
      setEditingQuestionId(null);
    } catch (error) {
      console.error("Failed to save explanation", error);
      alert("Failed to save explanation. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveShortAnswer = async (questionId: number, shortAnswer: string) => {
    try {
      setSaving(true);
      console.log('Saving short answer:', { questionId, shortAnswer });
      const result = await adminApi.updateQuestion(questionId, { shortAnswer });
      console.log('Save result:', result);

      // Update local state
      setQuestions(prev => prev.map(q =>
        q.id === questionId ? { ...q, shortAnswer } : q
      ));
      setEditingShortAnswerId(null);
    } catch (error) {
      console.error("Failed to save short answer", error);
      alert("Failed to save short answer. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAnswer = async (answerId: number, content: string, isCorrect: boolean) => {
    try {
      setSaving(true);
      await adminApi.updateAnswer(answerId, { content, isCorrect });

      // Update local state
      setQuestions(prev => prev.map(q => ({
        ...q,
        answers: q.answers?.map((a: any) =>
          a.id === answerId ? { ...a, content, isCorrect } : a
        )
      })));
      setEditingAnswerId(null);
    } catch (error) {
      console.error("Failed to save answer", error);
      alert("Failed to save answer. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleCorrectAnswer = async (answerId: number, currentIsCorrect: boolean) => {
    try {
      setSaving(true);
      await adminApi.updateAnswer(answerId, { isCorrect: !currentIsCorrect });

      // Update local state
      setQuestions(prev => prev.map(q => ({
        ...q,
        answers: q.answers?.map((a: any) =>
          a.id === answerId ? { ...a, isCorrect: !currentIsCorrect } : a
        )
      })));
    } catch (error) {
      console.error("Failed to toggle answer", error);
      alert("Failed to update answer. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTitle = async () => {
    try {
      setSaving(true);
      await adminApi.updateExam(examId, { title: examTitle });
      setIsEditingTitle(false);
    } catch (error) {
      console.error("Failed to update exam title", error);
      alert("Failed to update exam title");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12 text-gray-500">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/exams"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Back to Exams"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Exam</h1>
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 w-full max-w-md"
                  autoFocus
                />
                <button
                  onClick={handleSaveTitle}
                  disabled={saving}
                  className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsEditingTitle(false);
                    loadQuestions(true); // Reload to reset title
                  }}
                  disabled={saving}
                  className="p-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <p className="text-sm text-gray-500">{examTitle || 'Untitled Exam'}</p>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-all"
                  title="Edit Title"
                >
                  <Edit className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <div key={question.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {question.type === 'choice' ? 'Choice' :
                          question.type === 'short_answer' ? 'Short Answer' :
                            question.type === 'true_false' ? 'True/False' : question.type}
                      </span>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        {editingContentId !== question.id && (
                          <button
                            onClick={() => setEditingContentId(question.id)}
                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
                          >
                            Edit Content
                          </button>
                        )}
                      </div>

                      {editingContentId === question.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={question.content || ''}
                            onChange={(e) => {
                              setQuestions(prev => prev.map(q =>
                                q.id === question.id ? { ...q, content: e.target.value } : q
                              ));
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px] text-gray-900"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveQuestionContent(question.id, question.content || '')}
                              disabled={saving}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              <Save className="w-4 h-4" />
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingContentId(null);
                                loadQuestions(true);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-900 font-medium markdown-content [&>p]:mb-4 [&>img]:my-4 [&>img]:rounded-lg [&>img]:max-h-96 [&>table]:w-full [&>table]:border-collapse [&>table]:mb-4 [&>table]:border [&>table]:border-gray-300 [&_th]:border [&_th]:border-gray-300 [&_th]:p-2 [&_th]:bg-gray-50 [&_td]:border [&_td]:border-gray-300 [&_td]:p-2">
                          <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex, rehypeRaw]}
                          >
                            {processContent(question.content)}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>

                    {/* Answers Section */}
                    {(question.type === 'short_answer' || question.type?.toLowerCase() === 'short_answer') ? (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-700 font-medium">Short Answer:</div>
                          {editingShortAnswerId !== question.id && (
                            <button
                              onClick={() => {
                                setEditingShortAnswerId(question.id);
                              }}
                              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
                            >
                              {question.shortAnswer ? 'Edit' : 'Add Answer'}
                            </button>
                          )}
                        </div>
                        {editingShortAnswerId === question.id ? (
                          <div className="space-y-3">
                            <textarea
                              value={question.shortAnswer || ''}
                              onChange={(e) => {
                                setQuestions(prev => prev.map(q =>
                                  q.id === question.id ? { ...q, shortAnswer: e.target.value } : q
                                ));
                              }}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
                              rows={4}
                              placeholder="Enter short answer..."
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  handleSaveShortAnswer(question.id, question.shortAnswer || '');
                                }}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                              >
                                <Save className="w-4 h-4" />
                                Save Answer
                              </button>
                              <button
                                onClick={() => {
                                  setEditingShortAnswerId(null);
                                  loadQuestions(true); // Reload to reset changes silently
                                }}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium disabled:opacity-50"
                              >
                                <X className="w-4 h-4" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className={`text-sm ${question.shortAnswer ? 'text-gray-600 bg-gray-50 p-3 rounded-lg' : 'text-gray-400 italic bg-gray-50 p-3 rounded-lg'}`}>
                            {question.shortAnswer || ''}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mb-4">
                        <div className="text-sm text-gray-700 font-medium mb-3">Answers:</div>
                        <div className="flex flex-col gap-3">
                          {question.answers?.map((answer: any) => (
                            <div
                              key={answer.id}
                              className={`p-4 rounded-lg border-2 transition-all ${answer.isCorrect
                                ? 'bg-green-50 border-green-500'
                                : 'bg-gray-50 border-gray-200'
                                }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="text-sm text-gray-700 [&>p]:mb-0">
                                    <ReactMarkdown
                                      remarkPlugins={[remarkMath]}
                                      rehypePlugins={[rehypeKatex, rehypeRaw]}
                                      components={{
                                        p: ({ node, ...props }) => <p className="mb-0" {...props} />
                                      }}
                                    >
                                      {processContent(answer.content)}
                                    </ReactMarkdown>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => handleToggleCorrectAnswer(answer.id, answer.isCorrect)}
                                    disabled={saving}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${answer.isCorrect
                                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                      } disabled:opacity-50`}
                                  >
                                    {answer.isCorrect ? 'Correct' : 'Mark as Correct'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Explanation Section */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-700">Explanation:</p>
                        {editingQuestionId !== question.id && (
                          <button
                            onClick={() => setEditingQuestionId(question.id)}
                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
                          >
                            {question.explanation ? 'Edit' : 'Add Explanation'}
                          </button>
                        )}
                      </div>
                      {editingQuestionId === question.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={question.explanation || ''}
                            onChange={(e) => {
                              setQuestions(prev => prev.map(q =>
                                q.id === question.id ? { ...q, explanation: e.target.value } : q
                              ));
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
                            rows={4}
                            placeholder="Enter explanation for this question..."
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveExplanation(question.id, question.explanation || '')}
                              disabled={saving}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                            >
                              <Save className="w-4 h-4" />
                              Save Explanation
                            </button>
                            <button
                              onClick={() => {
                                setEditingQuestionId(null);
                                loadQuestions(true); // Reload to reset changes silently
                              }}
                              disabled={saving}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium disabled:opacity-50"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className={`text-sm ${question.explanation ? 'text-gray-600' : 'text-gray-400 italic'} [&>p]:mb-2`}>
                          <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex, rehypeRaw]}
                          >
                            {processContent(question.explanation || '')}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 text-center text-gray-500 rounded-xl border border-gray-200">
              No questions found for this exam.
            </div>
          )}
        </div>
      </div>

      {/* Images Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto p-4 hidden lg:block">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Exam Images
        </h3>
        {loadingImages ? (
          <div className="text-center text-gray-500 text-sm">Loading images...</div>
        ) : images.length > 0 ? (
          <div className="space-y-4">
            {images.map((img: any) => (
              <div key={img.id} className="border border-gray-200 rounded-lg p-2">
                <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden mb-2">
                  <img src={img.url} alt="Exam image" className="object-contain w-full h-full" />
                </div>
                <button
                  onClick={() => copyToClipboard(img.url, img.id)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md text-xs font-medium transition-colors border border-gray-200"
                >
                  {copiedImageId === img.id ? (
                    <>
                      <Check className="w-3 h-3 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy Markdown
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-sm py-8">
            No images found for this exam.
          </div>
        )}
      </div>
    </div>
  );
}
