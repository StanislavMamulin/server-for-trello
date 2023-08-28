import { v4, validate as validateUUID } from 'uuid';
import { IBoard } from '../board/Board.model';
import { IColumn, NewPlaceColumn } from '../column/Column.model';
import { ICreateTask, ITask } from './Task.model';
import { InvalidUUIDError, NotExistUserError, NotFoundError } from '../../Errors/CustomErrors';
import { taskValidate } from '../../utils/task.validate';
import { getAllB } from '../../utils/constants';
import { moveTaskInColumn } from '../column/Column.service';
import { searchBoardByColumnID } from '../board/Board.service';

const dataBaseBoards: IBoard[] = getAllB();

export const searchTask = (id: string): ITask => {
    if (!validateUUID(id)) throw new InvalidUUIDError(id);

    let correctTask: ITask | undefined;
    dataBaseBoards.forEach((board) => {
        board.columns.forEach((column) => {
            column.tasks.forEach((task) => {
                if (task.idTask === id) correctTask = task;
            });
        });
    });

    if (!correctTask) throw new NotExistUserError(id);

    return correctTask;
};

export const searchTasks = (idBoard: string, idColumn: string): ITask[] | undefined => {
    if (!validateUUID(idBoard)) throw new InvalidUUIDError(idBoard);
    if (!validateUUID(idColumn)) throw new InvalidUUIDError(idColumn);

    return dataBaseBoards
        .find((board) => board.idBoard === idBoard)
        ?.columns.find((column) => column.idColumn === idColumn)?.tasks;
};

const searchBoardWhichExistTask = (id: string): IBoard => {
    let correctBoard: IBoard | undefined;

    dataBaseBoards.forEach((board) => {
        board.columns.forEach((column) => {
            column.tasks.forEach((task) => {
                if (task.idTask === id) correctBoard = board;
            });
        });
    });

    if (!correctBoard) throw new NotExistUserError(id);

    return correctBoard;
};

const searchColumnWhichExistTask = (id: string, indexBoard: number): IColumn => {
    if (!validateUUID(id)) throw new InvalidUUIDError(id);

    let correctColums: IColumn | undefined;
    dataBaseBoards[indexBoard].columns.forEach((column) => {
        column.tasks.forEach((task) => {
            if (task.idTask === id) correctColums = column;
        });
    });

    if (!correctColums) throw new NotExistUserError(id);

    return correctColums;
};

export const createNewTask = (
    task: ICreateTask,
    idBoard: string,
    idColumn: string,
): Promise<ITask> =>
    new Promise((resolve) => {
        const board: IBoard | undefined = dataBaseBoards.find(
            (boardItem) => boardItem.idBoard === idBoard,
        );
        const column: IColumn | undefined = board?.columns.find(
            (columnItem) => columnItem.idColumn === idColumn,
        );
        const idTask: string = v4();
        const newTask: ITask = {
            ...task,
            idTask,
        };

        board?.columns.forEach((item) => {
            if (item.idColumn === column?.idColumn) {
                item.tasks.push(newTask);
            }
        });

        resolve(newTask);
    });

export const createNewTaskInColumn = (task: ICreateTask, idColumn: string): Promise<ITask> =>
    new Promise((resolve, reject) => {
        const board: IBoard | undefined = searchBoardByColumnID(idColumn);

        if (board) {
            const column: IColumn | undefined = board.columns.find(
                (columnItem) => columnItem.idColumn === idColumn,
            );
            if (column) {
                const idTask: string = v4();
                const newTask: ITask = {
                    ...task,
                    idTask,
                };

                column.tasks.push(newTask);

                resolve(newTask);
            } else {
                reject(new Error('Column not found'));
            }
        } else {
            reject(new Error('Board not found'));
        }
    });

export const deleteTaskByIDS = (id: string): void => {
    const existingTask: ITask = searchTask(id);
    const existingBoard: IBoard = searchBoardWhichExistTask(id);
    const indexBoard: number = dataBaseBoards.indexOf(existingBoard);
    if (indexBoard === -1) throw new NotFoundError('Board not found');

    const existingColumn: IColumn = searchColumnWhichExistTask(id, indexBoard);
    const indexColumn: number = existingBoard.columns.indexOf(existingColumn);
    if (indexColumn === -1) throw new NotFoundError('Column not found');

    const indexTask: number = existingColumn.tasks.indexOf(existingTask);
    if (indexTask === -1) throw new NotFoundError('Task not found');

    dataBaseBoards[indexBoard].columns[indexColumn].tasks.splice(indexTask, 1);
};

export const updateTaskById = (id: string, task: ITask): void => {
    taskValidate(task);

    const existingTask: ITask = searchTask(id);
    const existingBoard: IBoard = searchBoardWhichExistTask(id);
    const indexBoard: number = dataBaseBoards.indexOf(existingBoard);
    if (indexBoard === -1) throw new NotFoundError('Board not found');

    const existingColumn: IColumn = searchColumnWhichExistTask(id, indexBoard);
    const indexColumn: number = existingBoard.columns.indexOf(existingColumn);
    if (indexColumn === -1) throw new NotFoundError('Column not found');

    const indexTask: number = existingColumn.tasks.indexOf(existingTask);
    if (indexTask === -1) throw new NotFoundError('Task not found');

    const taskNeedUpdate: ITask = dataBaseBoards[indexBoard].columns[indexColumn].tasks[indexTask];

    dataBaseBoards[indexBoard].columns[indexColumn].tasks[indexTask] = {
        ...taskNeedUpdate,
        ...task,
    };
};

export const moveTaskToNewColumn = (taskId: string, newPlaceData: NewPlaceColumn): void => {
    const taskToMove: ITask = searchTask(taskId);

    deleteTaskByIDS(taskId);
    moveTaskInColumn(taskToMove, newPlaceData);
};
