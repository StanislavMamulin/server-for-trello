import { TaskBadRequestError, TaskValidationError } from '../Errors/CustomErrors';
import { ITask } from '../services/task/Task.model';

export const taskValidate = (task: ITask) => {
    const { nameTask, descriptionTask } = task;

    if (nameTask && typeof task.nameTask !== 'string')
        throw new TaskBadRequestError(TaskValidationError.nameTask);
    if (descriptionTask && typeof task.descriptionTask !== 'string')
        throw new TaskBadRequestError(TaskValidationError.descriptionTask);
};
