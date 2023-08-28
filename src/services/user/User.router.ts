import bcrypt from 'bcryptjs';
import { ServerResponse } from 'http';
import jwt from 'jsonwebtoken';
import { envConfig } from '../../common/config';
import { BadRequestError, NotExistUserError } from '../../Errors/CustomErrors';
import { HandleError } from '../../Errors/HandlerError';
import { IRequest } from '../../Server/Server.interface';
import { RouterCallbackFunc } from '../../Server/Server.types';
import { commonJSONResponseHeaders, sendJSONResponse, sendResponse } from '../../utils/network';
import {
    IUser,
    AccessLevel,
    UserEditParams,
    UserProfile,
    UserRegistration,
    UserLogin,
} from './User.model';
import { createUser, editUser, getUser, getUserProfileById } from './User.service';

export interface UserTokenPayload {
    userId: string;
    email: string;
    iat: number;
    exp: number;
}

const generateToken = (user: IUser): string =>
    jwt.sign(
        {
            userId: user.id,
            email: user.email,
        },
        envConfig.TOKEN_KEY,
        {
            expiresIn: '1h',
        },
    );

export const userRegistration: RouterCallbackFunc = async (req, res): Promise<void> => {
    let data = '';
    req.on('data', (chunk) => {
        data += chunk;
    });
    req.on('end', async () => {
        try {
            const { firstName, lastName, email, password, gender }: UserRegistration =
                JSON.parse(data);

            if (!(email && password && firstName && lastName && gender)) {
                const STATUS_MESSAGE = 'All fields are required';
                res.writeHead(400, STATUS_MESSAGE);
                res.end(STATUS_MESSAGE);
                return;
            }

            const isUserExist: IUser | undefined = getUser(email);
            if (isUserExist) {
                const STATUS_MESSAGE = 'The User already exist';
                res.writeHead(409, STATUS_MESSAGE);
                res.end(STATUS_MESSAGE);
                return;
            }

            const encryptedPassword: string = await bcrypt.hash(password, 10);

            const user: IUser = createUser({
                firstName,
                lastName,
                email,
                password: encryptedPassword,
                accessLevel: AccessLevel.User,
                gender,
            });

            user.token = generateToken(user);

            res.writeHead(201, commonJSONResponseHeaders);
            res.end(JSON.stringify(user));
        } catch (err) {
            HandleError(req, res, err);
        }
    });
};

export const userLogin: RouterCallbackFunc = async (
    req: IRequest,
    res: ServerResponse,
): Promise<void> => {
    let data = '';
    req.on('data', (chunk) => {
        data += chunk;
    });
    req.on('end', async () => {
        try {
            const { email, password }: UserLogin = JSON.parse(data);
            if (!(email && password)) {
                const STATUS_MESSAGE = 'All fields are required';
                sendResponse({
                    response: res,
                    statusCode: 400,
                    statusMessage: STATUS_MESSAGE,
                });
                return;
            }

            const existedUser: IUser | undefined = getUser(email);
            if (!existedUser || !(await bcrypt.compare(password, existedUser.password))) {
                sendResponse({
                    response: res,
                    statusCode: 401,
                    statusMessage: 'Invalid credentials',
                });
                return;
            }

            existedUser.token = generateToken(existedUser);

            sendJSONResponse({
                response: res,
                statusCode: 200,
                statusMessage: 'ok',
                payload: {
                    ...existedUser,
                    expiresIn: new Date(new Date().getTime() + 3600 * 1000),
                },
            });
        } catch (err) {
            HandleError(req, res, err);
        }
    });
};

export const updateUser: RouterCallbackFunc = (req: IRequest, res: ServerResponse): void => {
    if (!req.bodyData) throw new BadRequestError('field');
    if (!req.user) throw new BadRequestError('field');

    try {
        const boardData: UserEditParams = JSON.parse(req.bodyData);
        const editedUser: UserProfile | undefined = editUser(req.user.id, boardData);
        if (!editedUser) throw new NotExistUserError(req.user.id);

        sendJSONResponse({
            response: res,
            statusCode: 200,
            statusMessage: 'Success',
            payload: editedUser,
        });
    } catch (err) {
        HandleError(req, res, err);
    }
};

export const getUserInfo: RouterCallbackFunc = (req: IRequest, res: ServerResponse): void => {
    if (!req.user) throw new BadRequestError('field');

    try {
        const userProfile: UserProfile | undefined = getUserProfileById(req.user.id);
        if (!userProfile) throw new NotExistUserError(req.user.id);

        sendJSONResponse({
            response: res,
            statusCode: 200,
            statusMessage: 'Success',
            payload: userProfile,
        });
    } catch (err) {
        HandleError(req, res, err);
    }
};
