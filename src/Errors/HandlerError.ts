import { RouterCallbackFunc } from '../Server/Server.types';
import { BaseError, InvalidToken, NotFoundError, ServerInternalError } from './CustomErrors';
import { ErrorMessages } from './Error.messages';

const HandleError: RouterCallbackFunc = (_req, res, err) => {
    if (err instanceof BaseError) {
        res.statusCode = err.code;
        res.end(err.message);
    } else if (err instanceof SyntaxError) {
        res.statusCode = 400;
        res.end(`
            There is a SyntaxError
            There are the possible reason:
            Unexpected token } in JSON -> Remove last comma
        `);
    } else if (err instanceof NotFoundError) {
        res.statusCode = err.code;
        res.end(ErrorMessages.NOT_FOUND);
    } else if (err instanceof InvalidToken) {
        res.statusCode = err.code;
        res.end(ErrorMessages.INVALID_TOKEN);
    } else {
        const { code, message } = new ServerInternalError();
        res.statusCode = code;
        res.end(message);
    }
};

export { HandleError };
