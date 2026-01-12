'use client';

import { adminApi } from '@/lib/api/admin';
import { Calendar, ChevronLeft, ChevronRight, Image as ImageIcon, Layers } from "lucide-react";
import { useEffect, useState } from 'react';

export default function CoursesPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    loadCourses();
  }, [page]);

  const loadCourses = async () => {
    try {
      if (page === 1) setLoading(true);
      const coursesData = await adminApi.getCourses(page, limit);
      setData(coursesData);
      setTotalPages(coursesData.totalPages || 1);
    } catch (error) {
      console.error("Failed to load courses", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return <div className="p-8 text-center">Loading courses...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">Failed to load courses.</div>;
  }

  const courses = data.data;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses Management</h1>
          <p className="text-gray-500 text-sm mt-1">Total: {data.total} courses</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Course</th>
                <th className="px-6 py-4 font-semibold">Subject</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.map((course: any) => (
                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{course.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">
                          {course.description || "No description"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {course.subject ? (
                      <div className="flex items-center gap-1.5 text-indigo-600 font-medium">
                        <Layers className="w-4 h-4" />
                        {course.subject.name}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No Subject</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {course.price ? (
                      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)
                    ) : (
                      <span className="text-green-600">Free</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(course.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No courses found.
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
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
