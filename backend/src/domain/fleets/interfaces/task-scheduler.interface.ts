export type Task = () => void;
export type TaskId = string;

export type ScheduleTaskOptions = {
  taskId?: TaskId;
  task: Task;
  time: Date;
};
export interface ITaskScheduler {
  /**
   * Schedule a task
   * @param options The task to schedule
   */
  scheduleTask(options: ScheduleTaskOptions): Promise<void>;

  /**
   * Unschedule a task
   * @param taskId The task to unschedule
   */
  unScheduleTask(taskId: TaskId): Promise<void>;

  /**
   * Unschedule all tasks containing this string in their taskId
   * @param taskId The string to search for in the taskId
   */
  unScheduleTasks(taskId: string): Promise<void>;
}
