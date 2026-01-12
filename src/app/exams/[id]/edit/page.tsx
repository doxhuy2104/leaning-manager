'use client';

import { adminApi } from '@/lib/api/admin';
import { ArrowLeft, Save, X } from "lucide-react";
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [examTitle, setExamTitle] = useState('');
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);

  useEffect(() => {
    if (examId) {
      loadQuestions();
    }
  }, [examId]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getQuestionsByExamId(examId);
      const questionsData = response.data || [];
      setQuestions(questionsData);
      
      // Get exam title from first question if available
      if (questionsData.length > 0 && questionsData[0].exam) {
        setExamTitle(questionsData[0].exam.title || '');
      }
    } catch (error) {
      console.error("Failed to load questions", error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12 text-gray-500">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/exams"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Back to Exams"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Exam</h1>
          {examTitle && <p className="text-sm text-gray-500 mt-1">{examTitle}</p>}
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
                  <div
                    className="text-gray-900 font-medium mb-4"
                    dangerouslySetInnerHTML={{ __html: question.content }}
                  />

                  {/* Answers Section */}
                  {question.type === 'short_answer' ? (
                    <div className="mb-4">
                      <div className="text-sm text-gray-700 font-medium mb-1">Short Answer:</div>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {question.shortAnswer || 'No answer provided'}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="text-sm text-gray-700 font-medium mb-3">Answers:</div>
                      <div className="flex flex-col gap-3">
                        {question.answers?.map((answer: any) => (
                          <div
                            key={answer.id}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              answer.isCorrect
                                ? 'bg-green-50 border-green-500'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            {editingAnswerId === answer.id ? (
                              <div className="space-y-3">
                                <textarea
                                  value={answer.content || ''}
                                  onChange={(e) => {
                                    setQuestions(prev => prev.map(q => ({
                                      ...q,
                                      answers: q.answers?.map((a: any) => 
                                        a.id === answer.id ? { ...a, content: e.target.value } : a
                                      )
                                    })));
                                  }}
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                  rows={3}
                                />
                                <div className="flex items-center gap-2">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={answer.isCorrect}
                                      onChange={(e) => {
                                        setQuestions(prev => prev.map(q => ({
                                          ...q,
                                          answers: q.answers?.map((a: any) => 
                                            a.id === answer.id ? { ...a, isCorrect: e.target.checked } : a
                                          )
                                        })));
                                      }}
                                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Correct Answer</span>
                                  </label>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleSaveAnswer(answer.id, answer.content, answer.isCorrect)}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                                  >
                                    <Save className="w-4 h-4" />
                                    Save
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingAnswerId(null);
                                      loadQuestions(); // Reload to reset changes
                                    }}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium disabled:opacity-50"
                                  >
                                    <X className="w-4 h-4" />
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div
                                    className="text-sm text-gray-700"
                                    dangerouslySetInnerHTML={{ __html: answer.content }}
                                  />
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => handleToggleCorrectAnswer(answer.id, answer.isCorrect)}
                                    disabled={saving}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                      answer.isCorrect
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    } disabled:opacity-50`}
                                  >
                                    {answer.isCorrect ? 'Correct' : 'Mark as Correct'}
                                  </button>
                                  <button
                                    onClick={() => setEditingAnswerId(answer.id)}
                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
                                  >
                                    Edit
                                  </button>
                                </div>
                              </div>
                            )}
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
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                              loadQuestions(); // Reload to reset changes
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
                      <div
                        className={`text-sm ${question.explanation ? 'text-gray-600' : 'text-gray-400 italic'}`}
                        dangerouslySetInnerHTML={{ 
                          __html: question.explanation || 'No explanation provided. Click "Add Explanation" to add one.' 
                        }}
                      />
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
  );
}
