import connect from 'connect';
import { ServerResponse } from 'http';
import { IRequest } from '../Server/Server.interface';
import { AccessLevel } from '../services/user/User.model';
import { sendResponse } from '../utils/network';

const hasAccess = (
    req: IRequest,
    res: ServerResponse,
    next: connect.NextFunction,
    requireAccessLevel: AccessLevel[],
): void => {
    let access = false;
    if (req.user) {
        access = requireAccessLevel.includes(req.user.accessLevel);
    } else {
        access = requireAccessLevel.includes(AccessLevel.Anonymous);
    }

    if (access) {
        next();
    } else {
        sendResponse({
            response: res,
            statusCode: 401,
            statusMessage: 'Access denied',
        });
    }
};

export const accessWithLevel =
    (accessLevel: AccessLevel[]) =>
    (req: IRequest, res: ServerResponse, next: connect.NextFunction) =>
        hasAccess(req, res, next, accessLevel);
