import {
    createNewColumn,
    deleteColumnByID,
    updateColumnById,
    searchColumns,
    searchColumn,
    moveColumnToNewPlace,
} from './Column.service';
import { RouterCallbackFunc } from '../../Server/Server.types';
import { HandleError } from '../../Errors/HandlerError';
import { COLUMN_URL, COLUMN_URL_ID, COLUMN_URL_MOVE } from '../../utils/constants';
import { NotFoundError, RequiredParametersNotProvided } from '../../Errors/CustomErrors';
import { commonJSONResponseHeaders } from '../../utils/network';
import { IColumn, IColumnCreate } from './Column.model';
import { NewColumnPlace } from '../board/Board.model';

export const getColumnByID: RouterCallbackFunc = async (req, res) => {
    try {
        const { url } = req;
        const columnId: string | undefined = url?.substring(`/${COLUMN_URL_ID}`.length);
        if (!columnId) throw new RequiredParametersNotProvided('Column ID not provided');

        const currentCollumn = searchColumn(columnId);

        res.writeHead(200, commonJSONResponseHeaders);
        res.end(JSON.stringify(currentCollumn));
    } catch (err) {
        HandleError(req, res, err);
    }
};

export const getAllColumsByID: RouterCallbackFunc = async (req, res) => {
    try {
        const { url } = req;
        const boardId: string | undefined = url?.substring(`/${COLUMN_URL}`.length);
        if (!boardId) throw new RequiredParametersNotProvided('Board ID not provided');

        const columns = searchColumns(boardId);

        res.writeHead(200, commonJSONResponseHeaders);
        res.end(JSON.stringify(columns));
    } catch (err) {
        HandleError(req, res, err);
    }
};

export const createColumn: RouterCallbackFunc = async (req, res) => {
    try {
        if (!req.url?.startsWith(COLUMN_URL)) throw new NotFoundError();
        if (!req.bodyData) throw new NotFoundError();

        const boardId: string = req.url.substring(`/${COLUMN_URL}`.length);
        if (!boardId) throw new RequiredParametersNotProvided('Board ID not provided');

        const columnData: IColumnCreate = JSON.parse(req.bodyData);
        const newColumn: IColumn = await createNewColumn(columnData, boardId);

        res.writeHead(200, commonJSONResponseHeaders);
        res.end(JSON.stringify(newColumn));
    } catch (err) {
        HandleError(req, res, err);
    }
};

export const deleteColumn: RouterCallbackFunc = async (req, res) => {
    try {
        const { url } = req;
        const columnId: string | undefined = url?.substring(`/${COLUMN_URL}`.length);
        if (!columnId) throw new RequiredParametersNotProvided('Column ID not provided');

        await deleteColumnByID(columnId);

        res.writeHead(204, commonJSONResponseHeaders);
        res.end();
    } catch (err) {
        HandleError(req, res, err);
    }
};

export const updateColumn: RouterCallbackFunc = async (req, res) => {
    try {
        if (!req.bodyData) throw new NotFoundError();

        const { url } = req;
        const columnId: string | undefined = url?.substring(`/${COLUMN_URL}`.length);
        if (!columnId) throw new RequiredParametersNotProvided('Column ID not provided');

        const columnData: IColumn = JSON.parse(req.bodyData);
        await updateColumnById(columnId, columnData);

        res.writeHead(200, commonJSONResponseHeaders);
        res.end(JSON.stringify(columnData));
    } catch (err) {
        HandleError(req, res, err);
    }
};

export const moveColumnToBoard: RouterCallbackFunc = async (req, res) => {
    try {
        if (!req.bodyData) throw new NotFoundError();

        const { url } = req;
        const columnId: string | undefined = url?.substring(`/${COLUMN_URL_MOVE}`.length);
        if (!columnId) throw new RequiredParametersNotProvided('Task ID not provided');

        const columnData: NewColumnPlace = JSON.parse(req.bodyData);
        moveColumnToNewPlace(columnId, columnData);

        res.writeHead(200, commonJSONResponseHeaders);
        res.end(JSON.stringify(columnData));
    } catch (err) {
        HandleError(req, res, err);
    }
};
