import { useQuery } from '@tanstack/react-query';
import apiClient from '../client';
import { Endpoints } from '../endpoints';
import type {
  ApiResponse,
  CourseEntity,
  DocumentEntity,
  ParagraphDetailResponse,
  ParagraphEntity,
} from '../types';

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () =>
      apiClient.get<unknown, ApiResponse<{ courses: CourseEntity[] }>>(Endpoints.COURSE_LIST),
    select: (res) => res.data,
  });
}

export function useDocuments(courseId: number | undefined) {
  return useQuery({
    queryKey: ['documents', courseId],
    queryFn: () =>
      apiClient.get<unknown, ApiResponse<DocumentEntity[]>>(Endpoints.DOCUMENT_LIST, {
        params: { course_id: courseId },
      }),
    select: (res) => res.data,
    enabled: !!courseId,
  });
}

export function useParagraphs(documentId: number | undefined) {
  return useQuery({
    queryKey: ['paragraphs', documentId],
    queryFn: () =>
      apiClient.get<unknown, ApiResponse<ParagraphEntity[]>>(Endpoints.PARAGRAPH_LIST, {
        params: { document_id: documentId },
      }),
    select: (res) => res.data,
    enabled: !!documentId,
  });
}

export function useParagraphDetail(paragraphId: number | undefined) {
  return useQuery({
    queryKey: ['paragraph', paragraphId],
    queryFn: () =>
      apiClient.get<unknown, ApiResponse<ParagraphDetailResponse>>(
        `${Endpoints.PARAGRAPH_DETAIL_V3}/${paragraphId}`,
      ),
    select: (res) => res.data,
    enabled: !!paragraphId,
    retry: false,
  });
}
