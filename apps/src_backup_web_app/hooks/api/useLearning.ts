import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

// Get all courses
export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.LEARNING.COURSES);
      return data;
    },
  });
}

// Get course by ID
export function useCourse(courseId: string) {
  return useQuery({
    queryKey: ['courses', courseId],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.LEARNING.COURSE(courseId));
      return data;
    },
    enabled: !!courseId,
  });
}

// Get user's learning progress
export function useLearningProgress(userId: string) {
  return useQuery({
    queryKey: ['learning-progress', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.LEARNING.USER_PROGRESS(userId));
      return data;
    },
    enabled: !!userId,
  });
}

// Enroll in course
export function useEnrollCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, courseId }: { userId: string; courseId: string }) => {
      const { data } = await apiClient.post(API_ENDPOINTS.LEARNING.ENROLL, {
        userId,
        courseId,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['learning-progress', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

// Complete module
export function useCompleteModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      courseId,
      moduleId,
    }: {
      userId: string;
      courseId: string;
      moduleId: string;
    }) => {
      const { data } = await apiClient.post(API_ENDPOINTS.LEARNING.COMPLETE_MODULE, {
        userId,
        courseId,
        moduleId,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['learning-progress', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['courses', variables.courseId] });
    },
  });
}

// Get quiz by ID
export function useQuiz(quizId: string) {
  return useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.LEARNING.QUIZ(quizId));
      return data;
    },
    enabled: !!quizId,
  });
}

// Submit quiz
export function useSubmitQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      quizId,
      answers,
    }: {
      userId: string;
      quizId: string;
      answers: Record<string, any>;
    }) => {
      const { data } = await apiClient.post(API_ENDPOINTS.LEARNING.SUBMIT_QUIZ, {
        userId,
        quizId,
        answers,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['learning-progress', variables.userId] });
    },
  });
}
