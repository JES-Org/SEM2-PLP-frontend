
 export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'PREREQUISITE' | 'WEEK' | 'RESOURCE';
  week_number?: number;
  day_range?: string;
  is_completed: boolean;
  order: number;
}

 export interface LearningPath {
  id: string;
  title: string;
  deadline?: string;
  completion_percentage: number;
  tasks: Task[];
  created_at: string;
  updated_at: string;
}
