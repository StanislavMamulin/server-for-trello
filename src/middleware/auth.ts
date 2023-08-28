import { ServerResponse } from 'http';
import jwt from 'jsonwebtoken';
import connect from 'connect';

import { envConfig } from '../common/config';
import { HandleError } from '../Errors/HandlerError';
import { IRequest } from '../Server/Server.interface';
import { sendResponse } from '../utils/network';
import { InvalidToken } from '../Errors/CustomErrors';
import { IUser } from '../services/user/User.model';
import { UserTokenPayload } from '../services/user/User.router';
import { getUserById } from '../services/user/User.service';

const getUserFromDecodedToken = (jwtToken: UserTokenPayload): IUser | undefined =>
    getUserById(jwtToken.userId);

export const auth = async (req: IRequest, res: ServerResponse, next: connect.NextFunction) => {
    if (req.method === 'OPTIONS') next();
    let data = '';

    req.on('data', (chunk) => {
        data += chunk;
    });
    req.on('end', () => {
        const token = req.headers['x-access-token'] as string;

        if (!token) {
            sendResponse({
                response: res,
                statusCode: 403,
                statusMessage: 'A token is required',
            });
        } else {
            try {
                jwt.verify(token, envConfig.TOKEN_KEY, (err, decoded) => {
                    if (err) throw new InvalidToken(err.message);

                    req.user = getUserFromDecodedToken(decoded as UserTokenPayload);
                    req.bodyData = data;
                    return next();
                });
            } catch (err) {
                HandleError(req, res, err);
            }
        }
    });
};
