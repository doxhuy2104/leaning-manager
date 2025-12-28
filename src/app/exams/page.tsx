
import { AlertCircle, BookOpen, Clock, FileText } from "lucide-react";

async function getExams() {
  try {
    const res = await fetch("http://localhost:5000/management/exams", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch exams");
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ExamsPage() {
  const data = await getExams();

  if (!data) {
    return <div className="p-8 text-center text-red-500">Failed to load exams.</div>;
  }

  const exams = data.data;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Management</h1>
          <p className="text-gray-500 text-sm mt-1">Total: {data.total} exams</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4 font-semibold">Exam Title</th>
                <th className="px-6 py-4 font-semibold">Code</th>
                <th className="px-6 py-4 font-semibold">Related Course/Lesson</th>
                <th className="px-6 py-4 font-semibold">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {exams.map((exam: any) => (
                <tr key={exam.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{exam.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-1 max-w-xs" title={exam.description}>
                          {exam.description || "No description"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                      {exam.code || "NO-CODE"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {exam.lesson ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                          <BookOpen className="w-3 h-3" />
                          {exam.lesson.course?.title || "Unknown Course"}
                        </div>
                        <div className="text-xs text-gray-500 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                          {exam.lesson.title}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Unlinked
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {new Date(exam.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
              {exams.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No exams found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
