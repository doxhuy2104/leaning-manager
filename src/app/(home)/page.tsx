
import {
  Activity,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Layers,
  Target,
  Users
} from "lucide-react";

async function getManagementData() {
  try {
    const res = await fetch("http://localhost:5000/management", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching management data:", error);
    return null;
  }
}

async function getRecentHistories() {
  try {
    const res = await fetch("http://localhost:5000/management/histories?page=1&limit=5", {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const [data, historyData] = await Promise.all([
    getManagementData(),
    getRecentHistories()
  ]);

  if (!data) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2 className="text-2xl font-bold">Connection Error</h2>
        <p>Could not connect to the management server (http://localhost:5000).</p>
      </div>
    );
  }

  const { totals, analytics } = data;
  const recentActivity = historyData?.data || [];

  const stats = [
    {
      title: "Total Users",
      value: totals.users,
      icon: Users,
      color: "bg-blue-500",
      subtext: `${totals.activeUsers} Active, ${totals.verifiedUsers} Verified`,
    },
    {
      title: "Exams",
      value: totals.exams,
      icon: FileText,
      color: "bg-purple-500",
      subtext: `${totals.examHistories} Taken`,
    },
    {
      title: "Courses",
      value: totals.courses,
      icon: BookOpen,
      color: "bg-green-500",
      subtext: `${totals.lessons} Lessons`,
    },
    {
      title: "Subjects",
      value: totals.subjects,
      icon: Layers,
      color: "bg-indigo-500",
    },
    {
      title: "Groups",
      value: totals.groups,
      icon: Users,
      color: "bg-orange-500",
    },
    {
      title: "Avg Score",
      value: analytics.averageExamScore ? Number(analytics.averageExamScore).toFixed(1) : "N/A",
      icon: Target,
      color: "bg-red-500",
      isScore: true,
    }
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Real-time metrics from your education platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </h3>
                  {stat.subtext && (
                    <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                      {stat.subtext}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10 dark:bg-opacity-20`}>
                  <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Links Section matching the Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" /> Recent Exam Activity
          </h3>

          {recentActivity.length > 0 ? (
            <div className="overflow-hidden">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3">Exam</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Time Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {recentActivity.map((history: any) => (
                    <tr key={history.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {history.exam?.title || "Unknown Exam"}
                      </td>
                      <td className="px-4 py-3">
                        {history.score !== null ? (
                          <span className={`font-semibold ${history.score >= 5 ? 'text-green-600' : 'text-red-600'}`}>
                            {history.score}
                          </span>
                        ) : "N/A"}
                      </td>
                      <td className="px-4 py-3 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {history.timeSpent ? `${Math.floor(history.timeSpent / 60)}m` : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic">No recent activity logs available.</p>
          )}
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" /> System Status
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-gray-600 dark:text-gray-300 font-medium">Server API</span>
              <span className="flex items-center gap-1.5 text-green-700 dark:text-green-400 font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Online
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-300">Database</span>
              <span className="text-green-600 font-medium">Connected</span>
            </div>
            <div className="flex justify-between items-center text-sm border-t pt-3 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-300">Last Synced</span>
              <span className="text-gray-500 text-xs">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
