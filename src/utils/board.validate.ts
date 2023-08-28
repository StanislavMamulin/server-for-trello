import { BoardBadRequestError, BoardValidationError } from '../Errors/CustomErrors';
import { IBoard } from '../services/board/Board.model';

export const boardValidate = (board: IBoard) => {
    const { nameBoard, descriptionBoard } = board;

    if (nameBoard && typeof board.nameBoard !== 'string')
        throw new BoardBadRequestError(BoardValidationError.nameBoard);
    if (descriptionBoard && typeof board.descriptionBoard !== 'string')
        throw new BoardBadRequestError(BoardValidationError.descriptionBoard);
};
