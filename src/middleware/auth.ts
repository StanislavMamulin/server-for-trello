import { ServerResponse } from 'http';
import jwt from 'jsonwebtoken';
import connect from 'connect';

import { envConfig } from '../common/config';
import { HandleError } from '../Errors/handler.error';
import { IRequest } from '../Server/server.interface';
import { sendResponse } from '../utils/network';
import { InvalidToken } from '../Errors/CustomErrors';

export const auth = async (req: IRequest, res: ServerResponse, next: connect.NextFunction) => {
    let data = '';
    req.on('data', (chunk) => data += chunk);
    req.on('end', () => {
        const token = req.headers['x-access-token'] as string;

        if (!token) {
            sendResponse({
                response: res,
                statusCode: 403,
                statusMessage: 'A token is required'
            })
            return;
        }

        try {
            jwt.verify(token, envConfig.TOKEN_KEY, (err, decoded) => {
                if (err) throw new InvalidToken(err.message);
            });
        } catch (err) {
            HandleError(req, res, err);
        }
    });

    return next();
}