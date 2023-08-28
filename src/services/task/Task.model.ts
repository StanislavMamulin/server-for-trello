import { ICheckBox } from '../checkList/CheckList.model';

export interface ICreateTask {
    nameTask: string;
    descriptionTask: string;
    checkLists: ICheckBox[];
}

export interface ITask extends ICreateTask {
    idTask: string;
}
