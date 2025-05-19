/**
 * A tag is a simple string identifier for a task.
 */
export type Tag = string;

/**
 * Represents a single task in the schedule.
 */
export interface Task {
  label: string;
  description?: string;
  start: Date;
  end: Date;
  parent?: string;
  tags?: Tag[];
}

/**
 * Represents a full schedule of tasks.
 */
export interface Schedule {
  tasks: Task[];
}