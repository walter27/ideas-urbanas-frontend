import { Clasification } from './clasification.model';
import { Origin } from './origin.model';
import { Region } from './regions.model';

export interface Variable {
    _id: string;
    value: string;
    description: string;
    year: string;
    obj_Parroquia: Region;
    obj_Variable: Variable;
}
