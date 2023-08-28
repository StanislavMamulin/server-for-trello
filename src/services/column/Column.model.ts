import { ITask } from '../task/Task.model';

export interface IColumn {
    idColumn: string;
    nameColumn: string;
    descriptionColumn: string;
    tasks: ITask[];
}

export type IColumnCreate = Pick<IColumn, 'nameColumn' | 'descriptionColumn'>;

export type NewPlaceColumn = {
    toColumnId: string;
    newPosition: number;
};
