import { Injectable, Logger } from '@nestjs/common';
import {
  ITaskScheduler,
  ScheduleTaskOptions,
  Task,
  TaskId,
} from '../../domain/fleets/interfaces/task-scheduler.interface';
import { generateId } from '../../utils';

export type ScheduledTask = {
  task: Task;
  taskId: TaskId;
  timeout: NodeJS.Timeout;
};

@Injectable()
export class LocalTaskSchedulerService implements ITaskScheduler {
  private scheduledTasks: Map<TaskId, ScheduledTask> = new Map();
  private readonly logger = new Logger(LocalTaskSchedulerService.name);

  public async scheduleTask(options: ScheduleTaskOptions): Promise<void> {
    const { task, time } = options;
    const taskId = options.taskId || generateId();

    const delay = time.getTime() - Date.now();
    if (delay <= 0) {
      this.logger.warn(`Task ${taskId} is already due, executing now`);
      await this.executeTask(taskId);
      return;
    }

    this.logger.verbose(`Scheduling task ${taskId} to execute in ${delay} ms`);

    const timeout = setTimeout(async () => {
      await this.executeTask(taskId);
    }, delay);

    this.scheduledTasks.set(taskId, {
      task,
      taskId,
      timeout,
    });

    this.logger.log(`Task ${taskId} scheduled successfully`);
  }

  public async unScheduleTask(scheduledTask: ScheduledTask): Promise<void>;
  public async unScheduleTask(scheduledTaskId: TaskId): Promise<void>;
  public async unScheduleTask(
    scheduledTaskOrTaskId: TaskId | ScheduledTask,
  ): Promise<void> {
    let taskId: TaskId;
    let scheduledTask: ScheduledTask | undefined;
    if (typeof scheduledTaskOrTaskId === 'string') {
      taskId = scheduledTaskOrTaskId;
      scheduledTask = this.scheduledTasks.get(scheduledTaskOrTaskId);
    } else {
      scheduledTask = scheduledTaskOrTaskId;
      taskId = scheduledTask.taskId;
    }

    this.logger.log(`Attempting to unschedule task: ${taskId}`);

    if (!scheduledTask) {
      this.logger.warn(`Task ${taskId} not found`);
      return;
    }

    clearTimeout(scheduledTask.timeout);
    this.scheduledTasks.delete(taskId);

    this.logger.log(`Task ${taskId} unscheduled successfully`);
  }

  public async unScheduleTasks(taskId: string): Promise<void> {
    this.logger.log(`Unscheduling tasks with taskId containing: ${taskId}`);
    const tasksToUnschedule: ScheduledTask[] = [];

    // Loop through scheduled tasks and find matches
    for (const [taskIdKey, scheduledTask] of this.scheduledTasks) {
      if (taskIdKey.includes(taskId)) {
        tasksToUnschedule.push(scheduledTask);
      }
    }

    this.logger.verbose(
      `Found ${tasksToUnschedule.length} task(s) to unschedule`,
    );

    // Unschedule each found task
    for (const scheduledTask of tasksToUnschedule) {
      await this.unScheduleTask(scheduledTask);
    }
  }

  /**
   * Execute a task
   * @param taskId The task to execute
   */
  private async executeTask(taskId: TaskId): Promise<void> {
    this.logger.log(`Executing task: ${taskId}`);
    const scheduledTask = this.scheduledTasks.get(taskId);

    if (!scheduledTask) {
      this.logger.warn(`Task ${taskId} not found`);
      return;
    }

    // Unschedule the task after execution
    await this.unScheduleTask(taskId);

    // Try executing the task and log any error
    try {
      await scheduledTask.task();
      this.logger.log(`Task ${taskId} executed successfully`);
    } catch (error) {
      this.logger.error(
        `Error executing task ${taskId}: ${error.message}`,
        error.stack,
      );
    }
  }
}
