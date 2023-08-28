import { ServerResponse } from 'http';
import { NotFoundError, RequiredParametersNotProvided } from '../../Errors/CustomErrors';
import { HandleError } from '../../Errors/HandlerError';
import { RouterCallbackFunc } from '../../Server/Server.types';
import { BOARD_URL } from '../../utils/constants';
import {
    createNewBoard,
    removeBoard,
    updateBoardById,
    searchBoard,
    getUserBoards,
} from './Board.service';
import { commonJSONResponseHeaders } from '../../utils/network';
import { CreateBoard, IBoard } from './Board.model';
import { IRequest } from '../../Server/Server.interface';

export const getAllBoards: RouterCallbackFunc = (req: IRequest, res: ServerResponse) => {
    if (!req.user) throw new NotFoundError();

    try {
        const userBoards: IBoard[] = getUserBoards(req.user);

        res.writeHead(200, commonJSONResponseHeaders);
        res.end(JSON.stringify(userBoards));
    } catch (err) {
        HandleError(req, res, err);
    }
};

export const getBoardByID: RouterCallbackFunc = async (req: IRequest, res: ServerResponse) => {
    try {
        const { url } = req;
        const boardId: string | undefined = url?.substring(`/${BOARD_URL}`.length);

        if (boardId) {
            const currentBoard: IBoard = searchBoard(boardId);
            res.writeHead(200, commonJSONResponseHeaders);
            res.end(JSON.stringify(currentBoard));
        } else {
            throw new RequiredParametersNotProvided('Board ID not provided');
        }
    } catch (err) {
        HandleError(req, res, err);
    }
};

export const createBoard: RouterCallbackFunc = async (req: IRequest, res: ServerResponse) => {
    if (req.url !== BOARD_URL) throw new NotFoundError();
    if (!req.bodyData) throw new NotFoundError();
    if (!req.user) throw new NotFoundError();

    const data: string = req.bodyData;

    try {
        const boardData: CreateBoard = JSON.parse(data);
        const newBoard: IBoard = await createNewBoard(boardData, req.user);

        res.writeHead(200, commonJSONResponseHeaders);
        res.end(JSON.stringify(newBoard));
    } catch (err) {
        HandleError(req, res, err);
    }
};

export const deleteBoard: RouterCallbackFunc = async (req: IRequest, res: ServerResponse) => {
    try {
        const { url } = req;

        const boardId: string | undefined = url?.substring(`/${BOARD_URL}`.length);
        if (boardId) {
            removeBoard(boardId);
            res.writeHead(204, commonJSONResponseHeaders);
            res.end();
        } else {
            throw new RequiredParametersNotProvided('Board ID not provided');
        }
    } catch (err) {
        HandleError(req, res, err);
    }
};

export const updateBoard: RouterCallbackFunc = (req: IRequest, res: ServerResponse) => {
    if (!req.bodyData) throw new NotFoundError();

    const data: string = req.bodyData;

    try {
        const boardData: IBoard = JSON.parse(data);
        const { url } = req;

        const boardId: string | undefined = url?.substring(`/${BOARD_URL}`.length);
        if (boardId) {
            updateBoardById(boardId, boardData);
            res.writeHead(200, commonJSONResponseHeaders);
            res.end(JSON.stringify(boardData));
        } else {
            throw new RequiredParametersNotProvided('Board ID not provided');
        }
    } catch (err) {
        HandleError(req, res, err);
    }
};
