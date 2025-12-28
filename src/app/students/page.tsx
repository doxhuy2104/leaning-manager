
import { Calendar, Mail, Shield, User as UserIcon } from "lucide-react";

async function getUsers() {
  try {
    const res = await fetch("http://localhost:5000/management/users", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function StudentsPage() {
  const data = await getUsers();

  if (!data) {
    return <div className="p-8 text-center text-red-500">Failed to load students.</div>;
  }

  const students = data.data;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Students Management</h1>
          <p className="text-gray-500 text-sm mt-1">Total: {data.total} students</p>
        </div>
        {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          Add Student
        </button> */}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Group</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                {/* <th className="px-6 py-4 font-semibold">Actions</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {students.map((student: any) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        {student.avatar ? (
                          <img src={student.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <UserIcon className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{student.fullName || "N/A"}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Mail className="w-3 h-3" /> {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${student.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                        }`}>
                        {student.isActive ? "Active" : "Inactive"}
                      </div>
                      {student.isVerified && (
                        <span className="text-xs text-blue-600 flex items-center gap-1">
                          <Shield className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {student.group ? (
                      <span className="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 rounded text-xs font-medium border border-purple-100 dark:border-purple-900/50">
                        {student.group.name}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs italic">No Group</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(student.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  {/* <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-blue-600">Edit</button>
                  </td> */}
                </tr>
              ))}

              {students.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No students found.
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
