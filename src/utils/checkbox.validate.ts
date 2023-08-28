import { CheckboxBadRequestError, CheckboxValidationError } from '../Errors/CustomErrors';
import { ICheckBox } from '../services/checkList/CheckList.model';

export const checboxValidate = (checbox: ICheckBox) => {
    const { nameCheckBox } = checbox;

    if (nameCheckBox && typeof checbox.nameCheckBox !== 'string')
        throw new CheckboxBadRequestError(CheckboxValidationError.nameCheckBox);
};
