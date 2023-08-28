/* eslint-disable max-classes-per-file */
import { ErrorMessages } from './Error.messages';

enum ErrorCodes {
    'BAD_REQUEST' = 400,
    'UNAUTHORIZED' = 401,
    'NOT_FOUND' = 404,
    'SERVER_ERROR' = 500,
}

export enum ElementTypes {
    'BOARD' = 'Board',
    'COLUMN' = 'Column',
    'TASK' = 'Task',
    'CHECKBOX' = 'Checkbox',
    'CHECKLIST' = 'Checklist for task',
}

export enum BoardValidationError {
    nameBoard = 'name of board',
    descriptionBoard = 'description of board',
}
export enum ColumnValidationError {
    nameColumn = 'name of column',
    descriptionColumn = 'description of column',
}
export enum TaskValidationError {
    nameTask = 'name of task',
    descriptionTask = 'description of task',
}
export enum CheckboxValidationError {
    nameCheckBox = 'name of task',
}

export class BaseError extends Error {
    message: string;

    code: number;

    constructor(message: string, code = ErrorCodes.SERVER_ERROR) {
        super(message);
        this.message = message;
        this.code = code;
    }
}

export class NotFoundError extends BaseError {
    constructor(message: string = ErrorMessages.NOT_FOUND) {
        super(message, ErrorCodes.NOT_FOUND);
    }
}

export class InvalidToken extends BaseError {
    constructor(message: string = ErrorMessages.INVALID_TOKEN) {
        super(message, ErrorCodes.UNAUTHORIZED);
    }
}

export class ServerInternalError extends BaseError {
    constructor(message: string = ErrorMessages.SERVER_INTERNAL) {
        super(message, ErrorCodes.SERVER_ERROR);
    }
}

export class RequiredParametersNotProvided extends BaseError {
    constructor(message: string = ErrorMessages.PARAMETERS_NOT_PROVIDED) {
        super(message, ErrorCodes.NOT_FOUND);
    }
}

export class InvalidUUIDError extends BaseError {
    constructor(id: string) {
        if (id === '') {
            super(`ID is empty`, ErrorCodes.BAD_REQUEST);
        } else {
            super(`ID = ${id} is invalid (not uuid)`, ErrorCodes.BAD_REQUEST);
        }
    }
}

export class NotExistUserError extends BaseError {
    constructor(id: string) {
        super(`User with UserID = ${id} is not found`, ErrorCodes.NOT_FOUND);
    }
}

export class NotExistBoardError extends BaseError {
    constructor(id: string) {
        super(`Board with BoardID = ${id} is not found`, ErrorCodes.NOT_FOUND);
    }
}

export class NotExistError extends BaseError {
    constructor(type: ElementTypes, id: string) {
        super(`${type} with ID = ${id} is not found`, ErrorCodes.NOT_FOUND);
    }
}

export class CrashDataBaseError extends BaseError {
    constructor() {
        super(`Data base is corrupted\n. Please reload the App`, ErrorCodes.BAD_REQUEST);
    }
}

export class BadRequestError extends BaseError {
    constructor(option: string) {
        switch (option) {
            case 'field':
                super(
                    `${ErrorMessages.BAD_REQUEST}\nRequst.body does not contain required fields`,
                    ErrorCodes.BAD_REQUEST,
                );
                break;
            default:
                super(`${ErrorMessages.BAD_REQUEST}`);
        }
    }
}

export class BoardBadRequestError extends BaseError {
    constructor(option: BoardValidationError | 'field') {
        switch (option) {
            case 'field':
                super(
                    `${ErrorMessages.BAD_REQUEST}\nRequst.body does not contain required fields`,
                    ErrorCodes.BAD_REQUEST,
                );
                break;
            case BoardValidationError.nameBoard:
                super(
                    `${ErrorMessages.BAD_REQUEST}\n${BoardValidationError.nameBoard} must be a string`,
                    ErrorCodes.BAD_REQUEST,
                );
                break;
            case BoardValidationError.descriptionBoard:
                super(
                    `${ErrorMessages.BAD_REQUEST}\n${BoardValidationError.descriptionBoard} must be a string`,
                    ErrorCodes.BAD_REQUEST,
                );
                break;
            default:
                super(`${ErrorMessages.BAD_REQUEST}`);
        }
    }
}
export class ColumnBadRequestError extends BaseError {
    constructor(option: ColumnValidationError | 'field') {
        switch (option) {
            case 'field':
                super(
                    `${ErrorMessages.BAD_REQUEST}\nRequst.body does not contain required fields`,
                    ErrorCodes.BAD_REQUEST,
                );
                break;
            case ColumnValidationError.nameColumn:
                super(
                    `${ErrorMessages.BAD_REQUEST}\n${ColumnValidationError.nameColumn} must be a string`,
                    ErrorCodes.BAD_REQUEST,
                );
                break;
            case ColumnValidationError.descriptionColumn:
                super(
                    `${ErrorMessages.BAD_REQUEST}\n${ColumnValidationError.descriptionColumn} must be a string`,
                    ErrorCodes.BAD_REQUEST,
                );
                break;
            default:
                super(`${ErrorMessages.BAD_REQUEST}`);
        }
    }
}

export class TaskBadRequestError extends BaseError {
    constructor(option: TaskValidationError | 'field') {
        switch (option) {
            case 'field':
                super(
                    `${ErrorMessages.BAD_REQUEST}\nRequst.body does not contain required fields`,
                    ErrorCodes.BAD_REQUEST,
                );
                break;
            case TaskValidationError.nameTask:
                super(
                    `${ErrorMessages.BAD_REQUEST}\n${TaskValidationError.nameTask} must be a string`,
                    ErrorCodes.BAD_REQUEST,
                );
                break;
            case TaskValidationError.descriptionTask:
                super(
                    `${ErrorMessages.BAD_REQUEST}\n${TaskValidationError.descriptionTask} must be a string`,
                    ErrorCodes.BAD_REQUEST,
                );
                break;
            default:
                super(`${ErrorMessages.BAD_REQUEST}`);
        }
    }
}

export class CheckboxBadRequestError extends BaseError {
    constructor(option: CheckboxValidationError | 'field') {
        switch (option) {
            case 'field':
                super(
                    `${ErrorMessages.BAD_REQUEST}\nRequst.body does not contain required fields`,
                    ErrorCodes.BAD_REQUEST,
                );
                break;
            case CheckboxValidationError.nameCheckBox:
                super(
                    `${ErrorMessages.BAD_REQUEST}\n${CheckboxValidationError.nameCheckBox} must be a string`,
                    ErrorCodes.BAD_REQUEST,
                );
                break;
            default:
                super(`${ErrorMessages.BAD_REQUEST}`);
        }
    }
}
