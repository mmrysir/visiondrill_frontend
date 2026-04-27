export interface LessonContent {
  id: number;
  lesson_id: number;
  video_url: string | null;
  body: string | null;
  lesson_type: 'video' | 'text' | 'quiz';
  is_preview: boolean;
}

export interface Lesson {
  id: number;
  section_id: number;
  title: string;
  slug: string;
  order: number;
  lesson_type?: 'video' | 'text' | 'quiz';
  content: LessonContent | null;
}

export interface Section {
  id: number;
  course_id: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: number;
  slug: string;
  course_title: string;
  sections: Section[];
}
