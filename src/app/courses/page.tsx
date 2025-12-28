
import { Calendar, Image as ImageIcon, Layers } from "lucide-react";

async function getCourses() {
  try {
    const res = await fetch("http://localhost:5000/management/courses", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch courses");
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function CoursesPage() {
  const data = await getCourses();

  if (!data) {
    return <div className="p-8 text-center text-red-500">Failed to load courses.</div>;
  }

  const courses = data.data;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Courses Management</h1>
          <p className="text-gray-500 text-sm mt-1">Total: {data.total} courses</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4 font-semibold">Course</th>
                <th className="px-6 py-4 font-semibold">Subject</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {courses.map((course: any) => (
                <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-10 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{course.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">
                          {course.description || "No description"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {course.subject ? (
                      <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
                        <Layers className="w-4 h-4" />
                        {course.subject.name}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No Subject</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
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
      </div>
    </div>
  );
}
