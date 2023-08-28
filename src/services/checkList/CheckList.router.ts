import { ServerResponse } from 'http';
import {
    searchCheckbox,
    searchCheckLists,
    createNewCheckbox,
    deleteCheckboxByID,
    updateCheckboxById,
    updateChecklistById,
} from './CheckList.service';
import { RouterCallbackFunc } from '../../Server/Server.types';
import { HandleError } from '../../Errors/HandlerError';
import { CHECKBOX_URL, CHECKBOX_URL_ID, CHECKLIST_URL } from '../../utils/constants';
import { NotFoundError, RequiredParametersNotProvided } from '../../Errors/CustomErrors';
import { commonJSONResponseHeaders } from '../../utils/network';
import { ICheckBox, ICreateCheckBox } from './CheckList.model';
import { IRequest } from '../../Server/Server.interface';

export const getCheckBoxByID: RouterCallbackFunc = async (req, res) => {
    try {
        const { url } = req;
        const checkboxId: string | undefined = url?.substring(`/${CHECKBOX_URL_ID}`.length);

        if (checkboxId) {
            const currentCheckbox = searchCheckbox(checkboxId);
            res.writeHead(200, commonJSONResponseHeaders);
            res.end(JSON.stringify(currentCheckbox));
        } else {
            throw new RequiredParametersNotProvided('Checkbox ID not provided');
        }
    } catch (err) {
        HandleError(req, res, err);
    }
};

export const getAllCheckBoxesByIDS: RouterCallbackFunc = async (req, res) => {
    try {
        const { url } = req;
        const taskId: string | undefined = url?.substring(`/${CHECKBOX_URL}`.length);

        if (taskId) {
            const checkLists = searchCheckLists(taskId);
            res.writeHead(200, commonJSONResponseHeaders);
            res.end(JSON.stringify(checkLists));
        } else {
            throw new RequiredParametersNotProvided('Task ID not provided');
        }
    } catch (err) {
        HandleError(req, res, err);
    }
};

export const createCheckbox: RouterCallbackFunc = async (req, res) => {
    if (!req.url?.startsWith(CHECKBOX_URL)) throw new NotFoundError();
    if (!req.bodyData) throw new NotFoundError();

    const taskId = req.url?.substring(`/${CHECKBOX_URL}`.length);

    try {
        if (taskId) {
            const checkboxData: ICreateCheckBox = JSON.parse(req.bodyData);
            const newCheckbox = await createNewCheckbox(checkboxData, taskId);
            res.writeHead(200, commonJSONResponseHeaders);
            res.end(JSON.stringify(newCheckbox));
        } else {
            throw new RequiredParametersNotProvided('Task ID not provided');
        }
    } catch (err) {
        HandleError(req, res, err);
    }
};

export const deleteCheckbox: RouterCallbackFunc = async (req, res) => {
    try {
        const { url } = req;
        const checkboxId: string | undefined = url?.substring(`/${CHECKBOX_URL}`.length);

        if (checkboxId) {
            await deleteCheckboxByID(checkboxId);
            res.writeHead(204, commonJSONResponseHeaders);
            res.end();
        } else {
            throw new RequiredParametersNotProvided('Checkbox ID not provided');
        }
    } catch (err) {
        HandleError(req, res, err);
    }
};

export const updateCheckbox: RouterCallbackFunc = async (req: IRequest, res: ServerResponse) => {
    if (!req.bodyData) throw new NotFoundError();

    try {
        const checkboxData: ICheckBox = JSON.parse(req.bodyData);
        const { url } = req;
        const checkboxId = url?.substring(`/${CHECKBOX_URL}`.length);

        if (checkboxId) {
            await updateCheckboxById(checkboxId, checkboxData);
            res.writeHead(200, commonJSONResponseHeaders);
            res.end(JSON.stringify(checkboxData));
        } else {
            throw new RequiredParametersNotProvided('Checkbox ID not provided');
        }
    } catch (err) {
        HandleError(req, res, err);
    }
};

export const updateChecklist: RouterCallbackFunc = async (req, res) => {
    if (!req.bodyData) throw new NotFoundError();

    try {
        const checklistData: ICheckBox[] = JSON.parse(req.bodyData);
        const { url } = req;
        const taskId = url?.substring(`/${CHECKLIST_URL}`.length);

        if (taskId) {
            await updateChecklistById(taskId, checklistData);
            res.writeHead(200, commonJSONResponseHeaders);
            res.end(JSON.stringify(checklistData));
        } else {
            throw new RequiredParametersNotProvided('Task ID not provided');
        }
    } catch (err) {
        HandleError(req, res, err);
    }
};
