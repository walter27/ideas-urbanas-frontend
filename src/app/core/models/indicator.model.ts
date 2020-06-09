import { Clasification } from './clasification.model';

export interface Indicator {
    _id: string;
    name: string;
    description: string;
    obj_Clasification: Clasification;
    configs: any;
}
