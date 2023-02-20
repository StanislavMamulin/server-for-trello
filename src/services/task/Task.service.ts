import { IBoard } from '../board/Board.model'; 
import { IColumn, NewPlaceColumn } from '../column/Column.model';
import { ICreateTask, ITask } from './Task.model';
import { v4, validate as validateUUID } from 'uuid';
import { InvalidUUIDError, NotExistUserError, CrashDataBaseError } from '../../Errors/CustomErrors';
import { taskValidate } from '../../utils/task.validate';
import { getAllB } from '../../utils/constants';
import { moveTaskInColumn, searchColumn } from '../column/Column.service';
import { searchBoardByColumnID } from '../board/Board.service';

const dataBaseBoards = getAllB();

export const searchTask = (id: string) => {
    if (!validateUUID(id)) throw new InvalidUUIDError(id);

    let correctTask: ITask | undefined;
    dataBaseBoards.forEach(board => {
        board.columns.forEach(column => {
            column.tasks.forEach((task) => {
                if(task.idTask === id) correctTask = task;
            });
        })
    })

    if (!correctTask) throw new NotExistUserError(id);

    return correctTask;
}

export const searchTasks = (idBoard: string, idColumn: string): ITask[] | undefined => {
    if (!validateUUID(idBoard)) throw new InvalidUUIDError(idBoard);
    if (!validateUUID(idColumn)) throw new InvalidUUIDError(idColumn);

    return dataBaseBoards.find(board=>board.idBoard === idBoard)
        ?.columns.find(column=>column.idColumn === idColumn)
        ?.tasks;
}

const searchBoardWhichExistTask = (id: string): IBoard => {
    let correctBoard: IBoard | undefined;

    dataBaseBoards.forEach(board => {
        board.columns.forEach(column => {
          column.tasks.forEach(task => {
            if (task.idTask === id) correctBoard = board;
          });
        })
    })

    if (!correctBoard) throw new NotExistUserError(id);

    return correctBoard;
}
const searchColumnWhichExistTask = (id: string, indexBoard:number): IColumn => {
    if (!validateUUID(id)) throw new InvalidUUIDError(id);

    let correctColums: IColumn | undefined; 
    dataBaseBoards[indexBoard].columns.forEach(column=>{
        column.tasks.find(task=>{
            if(task.idTask === id) correctColums = column;
        });
    })

    if (!correctColums) throw new NotExistUserError(id);

    return correctColums;
}

export const createNewTask = (task: ICreateTask, idBoard: string, idColumn: string): Promise<ITask> => {
    return new Promise((resolve) => {
        const board: IBoard | undefined = dataBaseBoards.find(board => board.idBoard === idBoard);
        const column: IColumn | undefined = board?.columns.find(column => column.idColumn === idColumn);
        const idTask: string = v4();
        const newTask: ITask = {
            ...task,
            idTask,
        }

        board?.columns.forEach(item => {
            if(item.idColumn === column?.idColumn){
                item.tasks.push(newTask)
            }
        });

        resolve(newTask);
    })
}

export const createNewTaskInColumn = (task: ICreateTask, idColumn: string): Promise<ITask> => {
    return new Promise((resolve, reject) => {
        const board: IBoard | undefined = searchBoardByColumnID(idColumn);

        if (board) {
            const column: IColumn | undefined = board.columns.find(column => column.idColumn === idColumn);
            if (column) {

                const idTask: string = v4();
                const newTask: ITask = {
                    ...task,
                    idTask,
                }
                
                column.tasks.push(newTask);
                
                resolve(newTask);
            } else {
                reject('Column not found');
            }
        } else {
            reject('Board not found');
        }
    })
}

export const deleteTaskByIDS = (id:string): void => {
    const existingTask: ITask = searchTask(id);
    const existingBoard: IBoard = searchBoardWhichExistTask(id);
    const indexBoard: number = dataBaseBoards.indexOf(existingBoard);
    const existingColumn: IColumn = searchColumnWhichExistTask(id, indexBoard);
    const indexColumn: number = existingBoard.columns.indexOf(existingColumn);
    const indexTask: number = existingColumn.tasks.indexOf(existingTask);

    dataBaseBoards[indexBoard].columns[indexColumn].tasks.splice(indexTask,1);
};

export const updateTaskById = (id: string, task: ITask): void => {
    taskValidate(task);
    const existingTask: ITask = searchTask(id);
    const existingBoard: IBoard = searchBoardWhichExistTask(id);
    const indexBoard: number = dataBaseBoards.indexOf(existingBoard);
    const existingColumn: IColumn = searchColumnWhichExistTask(id,indexBoard);
    const indexColumn: number = existingBoard.columns.indexOf(existingColumn);
    const indexTask: number = existingColumn.tasks.indexOf(existingTask);
    const taskNeedUpdate: ITask = dataBaseBoards[indexBoard].columns[indexColumn].tasks[indexTask];

    dataBaseBoards[indexBoard].columns[indexColumn].tasks[indexTask] = {...taskNeedUpdate, ...task};
};

export const moveTaskToNewColumn = (
    taskId: string,
    newPlaceData: NewPlaceColumn
): void => {
    const taskToMove: ITask = searchTask(taskId);

    deleteTaskByIDS(taskId);
    moveTaskInColumn(taskToMove, newPlaceData);
}