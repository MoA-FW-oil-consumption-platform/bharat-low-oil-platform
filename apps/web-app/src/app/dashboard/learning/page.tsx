'use client';

import { useAuthStore } from '@/store/authStore';
import { useCourses, useLearningProgress, useEnrollCourse } from '@/hooks/api/useLearning';
import { BookOpen, CheckCircle, Clock, PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default function LearningPage() {
  const { user } = useAuthStore();
  const userId = user?.userId || '';

  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: progress, isLoading: progressLoading } = useLearningProgress(userId);
  const enrollMutation = useEnrollCourse();

  const handleEnroll = (courseId: string) => {
    enrollMutation.mutate({ userId, courseId });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Learning Center</h1>
          <p className="mt-1 text-sm text-gray-500">
            Expand your knowledge on healthy cooking and nutrition
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        {!progressLoading && progress && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 mb-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm opacity-90">Courses Enrolled</p>
                <p className="text-3xl font-bold">{progress.enrolledCourses || 0}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Courses Completed</p>
                <p className="text-3xl font-bold">{progress.completedCourses || 0}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Total Progress</p>
                <p className="text-3xl font-bold">{progress.overallProgress || 0}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Courses Grid */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Courses</h2>
          
          {coursesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : !courses || courses.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No courses available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: any) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  isEnrolled={progress?.enrolledCourseIds?.includes(course._id)}
                  onEnroll={handleEnroll}
                  isEnrolling={enrollMutation.isPending}
                />
              ))}
            </div>
          )}
        </div>

        {/* My Learning Section */}
        {progress && progress.enrolledCourses > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Learning</h2>
            <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
              {progress.enrolledCoursesDetails?.map((enrollment: any) => (
                <div key={enrollment.courseId} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {enrollment.courseName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {enrollment.completedModules}/{enrollment.totalModules} modules completed
                      </p>
                      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/learning/${enrollment.courseId}`}
                      className="ml-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Continue
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function CourseCard({
  course,
  isEnrolled,
  onEnroll,
  isEnrolling,
}: {
  course: any;
  isEnrolled?: boolean;
  onEnroll: (courseId: string) => void;
  isEnrolling: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
      <div className="h-40 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
        <BookOpen className="h-16 w-16 text-white" />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center">
            <PlayCircle className="h-4 w-4 mr-1" />
            {course.modules?.length || 0} modules
          </span>
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {course.duration || 'Self-paced'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium px-2 py-1 rounded ${
            course.level === 'beginner'
              ? 'bg-green-100 text-green-700'
              : course.level === 'intermediate'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {course.level || 'Beginner'}
          </span>

          {isEnrolled ? (
            <Link
              href={`/dashboard/learning/${course._id}`}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
            >
              Continue
            </Link>
          ) : (
            <button
              onClick={() => onEnroll(course._id)}
              disabled={isEnrolling}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isEnrolling ? 'Enrolling...' : 'Enroll'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
