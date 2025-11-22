import React from "react";

function DashboardSection() {
  const statsData = [
    { label: "Active Courses", value: "12" },
    { label: "Total Students", value: "384" },
    { label: "Quizzes Created", value: "47" },
    { label: "Avg. Score", value: "87%" },
  ];

  const quickActionsData = [
    { title: "Create Course", description: "Start a new course" },
    { title: "Create Quiz", description: "Generate new quiz" },
    { title: "Upload Materials", description: "Add study resources" },
    { title: "Share Content", description: "Distribute to students" },
  ];

  const recentCoursesData = [
    { abbreviation: "CS", title: "Computer Science 101", students: "45", updated: "2 days ago", status: "Active" },
    { abbreviation: "PH", title: "Physics Fundamentals", students: "32", updated: "1 week ago", status: "Active" },
    { abbreviation: "MA", title: "Mathematics Advanced", students: "28", updated: "3 days ago", status: "Draft" },
  ];

  const recentActivityData = [
    { text: 'Quiz "Linear Algebra Basics" completed by 23 students', time: "2 hours ago" },
    { text: 'New student enrolled in "Computer Science 101"', time: "4 hours ago" },
    { text: 'Study material "Chapter 5 Notes" uploaded', time: "1 day ago" },
    { text: "Feedback provided to 15 students", time: "2 days ago" },
  ];

  const pendingReviewsData = [
    { title: "Quiz Submissions", description: "Physics Fundamentals - Chapter 3 Quiz", pending: "12 pending" },
    { title: "Assignment Reviews", description: "Mathematics Advanced - Problem Set 4", pending: "8 pending" },
  ];

  return (
    <section className="w-full bg-neutral-50 min-h-screen py-14">
      
      <header className="container mx-auto px-6 lg:px-8 mb-12">
        <h1 className="text-3xl font-semibold text-neutral-900">Instructor Dashboard</h1>
        <p className="mt-3 text-base text-neutral-600">
          Manage your courses, quizzes, and student progress efficiently.
        </p>
      </header>

      
      <div className="container mx-auto px-6 lg:px-8 mb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {statsData.map((stat, i) => (
            <article
              key={i}
              className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-sm text-neutral-600">{stat.label}</p>
              <p className="text-3xl font-semibold text-neutral-900 mt-3">{stat.value}</p>
            </article>
          ))}
        </div>
      </div>

   
      <div className="container mx-auto px-6 lg:px-8 space-y-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 flex flex-col space-y-12">
          
            <section className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {quickActionsData.map((action, i) => (
                  <button
                    key={i}
                    className="rounded-lg border-2 border-dashed border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 transition-colors p-5 text-left"
                  >
                    <p className="text-base text-neutral-900 font-medium mb-1">{action.title}</p>
                    <p className="text-sm text-neutral-500">{action.description}</p>
                  </button>
                ))}
              </div>
            </section>

            
            <section className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-900">Recent Courses</h2>
                <button className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                  View all
                </button>
              </div>

              <div className="space-y-6">
                {recentCoursesData.map((course, i) => (
                  <article
                    key={i}
                    className="flex items-center justify-between border border-neutral-200 rounded-lg p-5 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-neutral-700 text-white flex items-center justify-center rounded-lg text-sm font-medium">
                        {course.abbreviation}
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-neutral-900">{course.title}</h3>
                        <p className="text-sm text-neutral-500 mt-1">
                          {course.students} students • Updated {course.updated}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        course.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {course.status}
                    </span>
                  </article>
                ))}
              </div>
            </section>
          </div>

          
          <aside className="flex flex-col space-y-12">
            
            <section className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">Recent Activity</h2>
              <ul className="space-y-6">
                {recentActivityData.map((activity, i) => (
                  <li key={i} className="pb-2 border-b border-neutral-100 last:border-0">
                    <p className="text-sm text-neutral-900 mb-1">{activity.text}</p>
                    <time className="text-xs text-neutral-500">{activity.time}</time>
                  </li>
                ))}
              </ul>
            </section>

           
            <section className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">Pending Reviews</h2>
              <div className="space-y-6">
                {pendingReviewsData.map((review, i) => (
                  <article key={i} className="bg-neutral-50 rounded-lg p-5 border border-neutral-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-medium text-neutral-900">{review.title}</h3>
                      <span className="px-3 py-1 rounded-full bg-neutral-200 text-neutral-700 text-xs font-medium">
                        {review.pending}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600">{review.description}</p>
                    <button className="mt-3 text-sm font-medium text-neutral-900 hover:underline">
                      Review now
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default DashboardSection;
