'use client';

import { adminApi } from '@/lib/api/admin';
import { ChevronLeft, ChevronRight, Mail, User as UserIcon } from "lucide-react";
import { useEffect, useState } from 'react';

export default function UsersPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    loadUsers();
  }, [page]);

  const loadUsers = async () => {
    try {
      if (page === 1) setLoading(true);
      const usersData = await adminApi.getUsers(page, limit);
      setData(usersData);
      setTotalPages(usersData.totalPages || 1);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return <div className="p-8 text-center">Loading users...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">Failed to load users.</div>;
  }

  const users = data.data;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Group</th>
                <th className="px-6 py-4 font-semibold">Attempts</th>

              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((student: any) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        {student.avatar ? (
                          <img src={student.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <UserIcon className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{student.fullName || ""}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Mail className="w-3 h-3" /> {student.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {student.group ? (
                      <span className="inline-flex items-center px-2 py-1  text-black-700 rounded text-base font-medium  ">
                        {student.group.name}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs italic"></span>
                    )}
                  </td>

                  <td className="px-6 py-4">

                    <span className="inline-flex items-center px-2 py-1  text-black-700 rounded text-base font-medium  ">
                      {student.examCount ? student.examCount : 0}
                    </span>

                  </td>

                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No students found.
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
