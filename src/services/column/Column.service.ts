import { v4, validate as validateUUID } from 'uuid';
import { IBoard, NewColumnPlace } from '../board/Board.model';
import { IColumn, IColumnCreate, NewPlaceColumn } from './Column.model';
import {
    ElementTypes,
    InvalidUUIDError,
    NotExistBoardError,
    NotExistError,
    NotFoundError,
} from '../../Errors/CustomErrors';
import { columnValidate } from '../../utils/column.validate';
import { getAllB } from '../../utils/constants';
import { moveColumnInBoard } from '../board/Board.service';
import { ITask } from '../task/Task.model';

const dataBaseBoards: IBoard[] = getAllB();

export const searchColumn = (id: string): IColumn => {
    if (!validateUUID(id)) throw new InvalidUUIDError(id);

    let correctColumn: IColumn | undefined;
    dataBaseBoards.forEach((board) => {
        board.columns.forEach((column) => {
            if (column.idColumn === id) correctColumn = column;
        });
    });

    if (!correctColumn) throw new NotExistError(ElementTypes.COLUMN, id);

    return correctColumn;
};

export const searchColumns = (id: string): IColumn[] | undefined => {
    if (!validateUUID(id)) throw new InvalidUUIDError(id);

    return dataBaseBoards.find((board) => board.idBoard === id)?.columns;
};

const searchBoardWhichExistColumn = (id: string): IBoard => {
    if (!validateUUID(id)) throw new InvalidUUIDError(id);

    let correctBoard: IBoard | undefined;
    dataBaseBoards.forEach((board) => {
        board.columns.forEach((column) => {
            if (column.idColumn === id) correctBoard = board;
        });
    });
    if (!correctBoard) throw new NotExistBoardError(id);

    return correctBoard;
};

export const createNewColumn = (column: IColumnCreate, idBoard: string): Promise<IColumn> =>
    new Promise((resolve) => {
        const board: IBoard | undefined = dataBaseBoards.find(
            (boardItem) => boardItem.idBoard === idBoard,
        );
        const idColumn: string = v4();
        const newColumn: IColumn = {
            ...column,
            idColumn,
            tasks: [],
        };
        board?.columns.push(newColumn);

        resolve(newColumn);
    });

export const deleteColumnByID = (id: string) => {
    const existingColumn: IColumn = searchColumn(id);
    const existingBoard: IBoard = searchBoardWhichExistColumn(id);
    const indexBoard: number = dataBaseBoards.indexOf(existingBoard);
    if (indexBoard === -1) throw new NotFoundError('Board not found');

    const indexColumn: number = existingBoard.columns.indexOf(existingColumn);
    if (indexColumn === -1) throw new NotFoundError('Column not found');

    dataBaseBoards[indexBoard].columns.splice(indexColumn, 1);
};

export const updateColumnById = (id: string, column: IColumn) => {
    columnValidate(column);

    const existingColumn: IColumn = searchColumn(id);
    const existingBoard: IBoard = searchBoardWhichExistColumn(id);
    const indexBoard: number = dataBaseBoards.indexOf(existingBoard);
    if (indexBoard === -1) throw new NotFoundError('Board not found');

    const indexColumn: number = existingBoard.columns.indexOf(existingColumn);
    if (indexColumn === -1) throw new NotFoundError('Column not found');

    const columnNeedUpdate: IColumn = dataBaseBoards[indexBoard].columns[indexColumn];

    dataBaseBoards[indexBoard].columns[indexColumn] = { ...columnNeedUpdate, ...column };
};

export const moveColumnToNewPlace = (columnId: string, newPlaceData: NewColumnPlace): void => {
    const columnToMove: IColumn = searchColumn(columnId);

    deleteColumnByID(columnId);
    moveColumnInBoard(columnToMove, newPlaceData);
};

export const moveTaskInColumn = (taskToMove: ITask, newPlaceData: NewPlaceColumn) => {
    const { toColumnId, newPosition } = newPlaceData;
    const toColumn: IColumn = searchColumn(toColumnId);

    toColumn.tasks.splice(newPosition, 0, taskToMove);
};
