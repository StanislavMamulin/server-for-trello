import { v4, validate as validateUUID } from 'uuid';
import { ICreateCheckBox, ICheckBox } from './CheckList.model';
import { ElementTypes, InvalidUUIDError, NotExistError } from '../../Errors/CustomErrors';
import { checboxValidate } from '../../utils/checkbox.validate';
import { getAllB } from '../../utils/constants';
import { IBoard } from '../board/Board.model';

const dataBaseBoards: IBoard[] = getAllB();

export const searchCheckbox = (id: string): ICheckBox => {
    if (!validateUUID(id)) throw new InvalidUUIDError(id);

    let correctCheckbox: ICheckBox | undefined;
    dataBaseBoards.forEach((board) => {
        board.columns.forEach((column) => {
            column.tasks.forEach((task) => {
                task.checkLists.forEach((checkbox) => {
                    if (checkbox.idCheckBox === id) {
                        correctCheckbox = checkbox;
                    }
                });
            });
        });
    });

    if (!correctCheckbox) throw new NotExistError(ElementTypes.CHECKBOX, id);

    return correctCheckbox;
};

export const searchCheckLists = (idTask: string): ICheckBox[] => {
    if (!validateUUID(idTask)) throw new InvalidUUIDError(idTask);

    let checkLists: ICheckBox[] | undefined;
    dataBaseBoards.forEach((board) => {
        board.columns.forEach((column) => {
            column.tasks.forEach((task) => {
                if (task.idTask === idTask) {
                    checkLists = task.checkLists;
                }
            });
        });
    });

    if (!checkLists) throw new NotExistError(ElementTypes.CHECKLIST, idTask);

    return checkLists;
};

export const createNewCheckbox = (checkbox: ICreateCheckBox, idTask: string): Promise<ICheckBox> =>
    new Promise((resolve) => {
        const idCheckBox: string = v4();
        const newCheckbox: ICheckBox = {
            ...checkbox,
            idCheckBox,
        };

        dataBaseBoards.forEach((board) => {
            board.columns.forEach((column) => {
                column.tasks.forEach((task) => {
                    if (task.idTask === idTask) {
                        task.checkLists.push(newCheckbox);
                    }
                });
            });
        });

        resolve(newCheckbox);
    });

export const deleteCheckboxByID = (id: string): void => {
    let boardIDX: number | undefined;
    let columnIDX: number | undefined;
    let taskIDX: number | undefined;
    let checboxIDX: number | undefined;

    dataBaseBoards.forEach((board, boardIndex) => {
        board.columns.forEach((column, columnIndex) => {
            column.tasks.forEach((task, taskIndex) => {
                task.checkLists.forEach((checkbox, checkboxIndex) => {
                    if (checkbox.idCheckBox === id) {
                        boardIDX = boardIndex;
                        columnIDX = columnIndex;
                        taskIDX = taskIndex;
                        checboxIDX = checkboxIndex;
                    }
                });
            });
        });
    });

    if (boardIDX && columnIDX && taskIDX && checboxIDX) {
        dataBaseBoards[boardIDX].columns[columnIDX].tasks[taskIDX].checkLists.splice(checboxIDX, 1);
    }
};

export const updateCheckboxById = (id: string, checkbox: ICheckBox): void => {
    checboxValidate(checkbox);
    const currentUpdate: ICheckBox = searchCheckbox(id);

    let boardIDX: number | undefined;
    let columnIDX: number | undefined;
    let taskIDX: number | undefined;
    let checboxIDX: number | undefined;

    dataBaseBoards.forEach((board, boardIndex) => {
        board.columns.forEach((column, columnIndex) => {
            column.tasks.forEach((task, taskIndex) => {
                task.checkLists.forEach((checkboxItem, checkboxIndex) => {
                    if (checkboxItem.idCheckBox === id) {
                        boardIDX = boardIndex;
                        columnIDX = columnIndex;
                        taskIDX = taskIndex;
                        checboxIDX = checkboxIndex;
                    }
                });
            });
        });
    });

    if (boardIDX && columnIDX && taskIDX && checboxIDX) {
        dataBaseBoards[boardIDX].columns[columnIDX].tasks[taskIDX].checkLists[checboxIDX] = {
            ...currentUpdate,
            nameCheckBox: checkbox.nameCheckBox,
            isChoose: checkbox.isChoose,
        };
    }
};

export const updateChecklistById = (taskId: string, checklist: ICheckBox[]): void => {
    dataBaseBoards.forEach((board) => {
        board.columns.forEach((column) => {
            column.tasks.forEach((task) => {
                if (task.idTask === taskId) {
                    task.checkLists = checklist;
                }
            });
        });
    });
};
