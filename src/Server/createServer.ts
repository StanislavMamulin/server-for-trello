import http from 'http';
import { envConfig } from '../common/config';
import { MethodType } from './Server.types';
import { NotFoundError } from '../Errors/CustomErrors';
import { HandleError } from '../Errors/HandlerError';
import connect from 'connect';

import { BOARD_URL, COLUMN_URL,COLUMN_URL_ID, COLUMN_URL_MOVE, LOGIN_URL, REGISTER_URL, TASK_URL, TASK_URL_ID, TASK_URL_MOVE } from '../utils/constants';
import { createBoard,getBoardByID, getAllBoards, deleteBoard, updateBoard } from '../services/board/Board.router';
import { createColumn, deleteColumn, updateColumn, getAllColumsByID,getColumnByID, moveColumnToBoard } from '../services/column/Column.router';
import { createTask, deleteTask, updateTask, getAllTasksByIDS, getTaskByID, moveTaskToColumn } from '../services/task/Task.router';
import { preflightRequest } from '../utils/network';
import { userLogin, userRegistration } from '../services/user/User.router';
import { auth } from '../middleware/auth';
import { accessWithLevel } from '../middleware/authorization';
import { AccessLevel } from '../services/user/User.model';

const SERVER_BOARDS = {
    GET: getBoardByID,
    POST: createBoard,
    DELETE: deleteBoard,
    PUT: updateBoard
}
const SERVER_COLUMNS = {
    GET: getAllColumsByID,
    POST: createColumn,
    DELETE: deleteColumn,
    PUT: updateColumn
}
const SERVER_TASKS = {
    GET: getAllTasksByIDS,
    POST: createTask,
    DELETE: deleteTask,
    PUT: updateTask
}

const app = connect();

const addAuthorizationAndAuthentication = () => {
    const allAuthUsers: AccessLevel[] = [AccessLevel.User, AccessLevel.Admin];
    const urls = [BOARD_URL, COLUMN_URL, TASK_URL];

    urls.forEach((url) => {
        app.use(url, auth);
        app.use(url, accessWithLevel(allAuthUsers));
    })
}

export const createServer = (port = envConfig.SERVER_PORT) => {
    addAuthorizationAndAuthentication();

    app.use(
        async (req, res) => {
            const method = req.method as MethodType;
            const url: string | undefined = req.url;
    
            try {
                if (method === "OPTIONS") preflightRequest(req, res)
                else if (url?.startsWith(BOARD_URL)) {
                    if (method === "GET" && url === BOARD_URL) await getAllBoards(req, res);
                    else await SERVER_BOARDS[method](req, res);
                } else if (url?.startsWith(COLUMN_URL)) {
                    if (method === "GET" && url?.startsWith(COLUMN_URL_ID)) await getColumnByID(req, res)
                    else if (method === "PUT" && url?.startsWith(COLUMN_URL_MOVE)) moveColumnToBoard(req, res);
                    else await SERVER_COLUMNS[method](req, res);
                } else if (url?.startsWith(TASK_URL)) {
                    if (method === "GET" && url?.startsWith(TASK_URL_ID)) getTaskByID(req, res);
                    else if (method === "PUT" && url?.startsWith(TASK_URL_MOVE)) moveTaskToColumn(req, res);
                    else await SERVER_TASKS[method](req, res);
                } else if (url?.startsWith(REGISTER_URL)) {
                    if (method === 'POST') userRegistration(req, res);
                } else if (url?.startsWith(LOGIN_URL)) {
                    if (method === 'POST') userLogin(req, res);
                } else {
                    throw new NotFoundError();
                }
            } catch (err) {
                HandleError(req, res, err);
            }
        }
    );

    const server = app.listen(port, () => {
        console.log(`Server running at port ${port}`)
    })

    return server;
}