import { IColumn } from '../column/Column.model';

export interface IBoard {
    idBoard: string;
    nameBoard: string;
    dateBoard: Date;
    descriptionBoard: string;
    isChosen: boolean;
    columns: IColumn[];
    ownerId: string;
}

export type CreateBoard = Pick<IBoard, 'nameBoard' | 'dateBoard' | 'descriptionBoard' | 'isChosen'>;

export type NewColumnPlace = {
    toBoardId: string;
    newPosition: number;
};
