import { Variable } from './variable.model';
import { Region } from './regions.model';

export interface Indicator {
    _id: string;
    ridit: number;
    ridit_normalize: number;
    year: number;
    obj_Variable: Variable;
    obj_Canton: Region;
}
