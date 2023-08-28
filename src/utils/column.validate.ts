import { ColumnBadRequestError, ColumnValidationError } from '../Errors/CustomErrors';
import { IColumn } from '../services/column/Column.model';

export const columnValidate = (column: IColumn) => {
    const { nameColumn, descriptionColumn } = column;

    if (nameColumn && typeof column.nameColumn !== 'string')
        throw new ColumnBadRequestError(ColumnValidationError.nameColumn);
    if (descriptionColumn && typeof column.descriptionColumn !== 'string')
        throw new ColumnBadRequestError(ColumnValidationError.descriptionColumn);
};
