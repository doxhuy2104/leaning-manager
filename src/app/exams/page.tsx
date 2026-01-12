'use client';

import { adminApi } from '@/lib/api/admin';
import { ArrowLeft, ChevronLeft, ChevronRight, Layers, Plus, Edit } from "lucide-react";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ExamsPage() {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'questions'>('list');
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);

  // Exam list state
  const [examsData, setExamsData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [examsLoading, setExamsLoading] = useState(false);

  // Questions state
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    if (viewMode === 'detail' && selectedSubject) {
      loadExams(selectedSubject.id);
    }
  }, [viewMode, selectedSubject, page]);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const subjectsData = await adminApi.getSubjects();
      setSubjects(subjectsData.data || []);
    } catch (error) {
      console.error("Failed to load subjects", error);
    } finally {
      setLoading(false);
    }
  };

  const loadExams = async (subjectId: number) => {
    try {
      setExamsLoading(true);
      const data = await adminApi.getExamsBySubject(subjectId, page, limit);
      setExamsData(data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to load exams", error);
    } finally {
      setExamsLoading(false);
    }
  };

  const loadQuestions = async (examId: number) => {
    try {
      setQuestionsLoading(true);
      const response = await adminApi.getQuestionsByExamId(examId);
      setQuestions(response.data || []);
    } catch (error) {
      console.error("Failed to load questions", error);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleSubjectClick = (subject: any) => {
    setSelectedSubject(subject);
    setPage(1);
    setViewMode('detail');
  };

  const handleExamClick = (exam: any) => {
    setSelectedExam(exam);
    setViewMode('questions');
    loadQuestions(exam.id);
  };

  const handleBackToSubjects = () => {
    setViewMode('list');
    setSelectedSubject(null);
    setExamsData(null);
  };

  const handleBackToExams = () => {
    setViewMode('detail');
    setSelectedExam(null);
    setQuestions([]);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading subjects...</div>;
  }

  if (viewMode === 'list') {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Exam Management</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => handleSubjectClick(subject)}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 mb-4 shrink-0  flex items-center justify-center overflow-hidden  group-hover:border-blue-200 transition-colors">
                {subject.image ? (
                  <img
                    src={subject.image}
                    alt={subject.title}
                    className="w-full h-full object-cover"
                    style={{ width: '64px', height: '64px' }}
                  />
                ) : (
                  <Layers className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {subject.title}
              </h3>
            </div>
          ))}
          {subjects.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No subjects found.
            </div>
          )}
        </div>
      </div>
    );
  }

  if (viewMode === 'questions') {
    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToExams}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Back to Exams"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{selectedExam?.title}</h1>
          </div>
          <Link
            href={`/exams/${selectedExam?.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            <Edit className="w-4 h-4" />
            Edit Exam
          </Link>
        </div>

        <div className="space-y-6">
          {questionsLoading ? (
            <div className="text-center py-12 text-gray-500">Loading questions...</div>
          ) : questions.length > 0 ? (
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

                    {question.type === 'short_answer' ? (
                      <div className="text-sm text-gray-700">{question.shortAnswer}</div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {question.answers?.map((answer: any) => (
                          <div
                            key={answer.id}
                            className="p-3 rounded-lg"
                            style={{
                              backgroundColor: answer.isCorrect
                                ? '#dcfce7'
                                : (question.type === 'true_false' ? '#fee2e2' : '#f9fafb'),
                              border: answer.isCorrect
                                ? '2px solid #22c55e'
                                : (question.type === 'true_false' ? '2px solid #ef4444' : '1px solid #e5e7eb')
                            }}
                          >
                            <div
                              className="text-sm text-gray-700"
                              dangerouslySetInnerHTML={{ __html: answer.content }}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {question.explanation && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-700 mb-1">Explanation:</p>
                        <div
                          className="text-sm text-gray-600"
                          dangerouslySetInnerHTML={{ __html: question.explanation }}
                        />
                      </div>
                    )}
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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToSubjects}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Back to Subjects"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{selectedSubject?.title}</h1>
        </div>
        <Link
          href={`/exams/create?subjectId=${selectedSubject?.id}`}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Exam
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {examsLoading ? (
          <div className="p-12 text-center text-gray-500">Loading exams for {selectedSubject?.title}...</div>
        ) : examsData ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Exam Title</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {examsData.data.map((exam: any) => (
                    <tr
                      key={exam.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleExamClick(exam)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">

                          <div>
                            <div className="font-medium text-gray-900">{exam.title}</div>
                          </div>
                        </div>
                      </td>

                    </tr>
                  ))}
                  {examsData.data.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No exams found for this subject.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-12 text-center text-red-500">Failed to load exams.</div>
        )}
      </div>
    </div>
  );
}
