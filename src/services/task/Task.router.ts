import { validate as validateUUID } from 'uuid';
import {
    createNewTask,
    deleteTaskByIDS,
    updateTaskById,
    searchTask,
    searchTasks,
    moveTaskToNewColumn,
    createNewTaskInColumn,
} from './Task.service';
import { RouterCallbackFunc } from '../../Server/Server.types';
import { HandleError } from '../../Errors/HandlerError';
import { TASK_URL, TASK_URL_ID, TASK_URL_MOVE } from '../../utils/constants';
import { NotFoundError, RequiredParametersNotProvided } from '../../Errors/CustomErrors';
import { commonJSONResponseHeaders } from '../../utils/network';
import { ICreateTask, ITask } from './Task.model';
import { NewPlaceColumn } from '../column/Column.model';

export const getTaskByID: RouterCallbackFunc = async (req, res) => {
    try {
        const { url } = req;
        const taskId: string | undefined = url?.substring(`/${TASK_URL_ID}`.length);

        if (!taskId) throw new RequiredParametersNotProvided('Task ID not provided');

        const currentTask = searchTask(taskId as string);
        res.writeHead(200, commonJSONResponseHeaders);
        res.end(JSON.stringify(currentTask));
    } catch (err) {
        HandleError(req, res, err);
    }
};

export const getAllTasksByIDS: RouterCallbackFunc = async (req, res) => {
    try {
        const { url } = req;
        const urlArr: string[] | undefined = url?.split('/');

        if (!urlArr || urlArr.length > 2 || urlArr.length < 1)
            throw new RequiredParametersNotProvided('Required IDs not provided');

        const boardId: string = urlArr[urlArr.length - 2];
        const columnId: string = urlArr[urlArr.length - 1];
        const tasks: ITask[] | undefined = searchTasks(boardId, columnId);

        if (!tasks) throw new NotFoundError('Tasks not found');

        res.writeHead(200, commonJSONResponseHeaders);
        res.end(JSON.stringify(tasks));
    } catch (err) {
        HandleError(req, res, err);
    }
};

export const createTask: RouterCallbackFunc = async (req, res) => {
    try {
        if (!req.url?.startsWith(TASK_URL)) throw new NotFoundError();
        if (!req.url) throw new NotFoundError();
        if (!req.bodyData) throw new NotFoundError();

        const urlArr: string[] = req.url.split('/');
        const ids: string[] = urlArr.filter(validateUUID);

        if (ids.length > 2 || ids.length < 1) throw new NotFoundError();

        const [firstId, secondId] = ids;

        const columnId = secondId || firstId;
        const boardId = secondId ? firstId : undefined;

        const taskData: ICreateTask = JSON.parse(req.bodyData);

        let newTask: ITask;
        if (boardId) {
            newTask = await createNewTask(taskData, boardId, columnId);
        } else {
            newTask = await createNewTaskInColumn(taskData, columnId);
        }

        res.writeHead(200, commonJSONResponseHeaders);
        res.end(JSON.stringify(newTask));
    } catch (err) {
        HandleError(req, res, err);
    }
};

export const deleteTask: RouterCallbackFunc = async (req, res) => {
    try {
        const { url } = req;

        const taskId: string | undefined = url?.substring(`/${TASK_URL}`.length);
        if (!taskId) throw new RequiredParametersNotProvided('Task ID not provided');

        await deleteTaskByIDS(taskId);
        res.writeHead(204, commonJSONResponseHeaders);
        res.end();
    } catch (err) {
        HandleError(req, res, err);
    }
};

export const updateTask: RouterCallbackFunc = async (req, res) => {
    try {
        if (!req.bodyData) throw new NotFoundError();
        const data = req.bodyData;

        const { url } = req;

        const taskId: string | undefined = url?.substring(`/${TASK_URL}`.length);
        if (!taskId) throw new RequiredParametersNotProvided('Task ID not provided');

        const taskData: ITask = JSON.parse(data);
        await updateTaskById(taskId, taskData);

        res.writeHead(200, commonJSONResponseHeaders);
        res.end(JSON.stringify(taskData));
    } catch (err) {
        HandleError(req, res, err);
    }
};

export const moveTaskToColumn: RouterCallbackFunc = async (req, res) => {
    try {
        if (!req.bodyData) throw new NotFoundError();
        const data = req.bodyData;

        const { url } = req;

        const taskId: string | undefined = url?.substring(`/${TASK_URL_MOVE}`.length);
        if (!taskId) throw new RequiredParametersNotProvided('Task ID not provided');

        const taskData: NewPlaceColumn = JSON.parse(data);
        moveTaskToNewColumn(taskId, taskData);

        res.writeHead(200, commonJSONResponseHeaders);
        res.end(JSON.stringify(taskData));
    } catch (err) {
        HandleError(req, res, err);
    }
};
