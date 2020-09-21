import { Clasification } from './clasification.model';
import { Origin } from './origin.model';

export interface Variable {
    _id: string;
    name: string;
    code: string;
    type: string;
    description: string;
    chart_type: string;
    obj_Clasification: Clasification;
    obj_Origin: Origin[];
    label: string;
    measure: string;
    measure_symbol: string;
    origins: Origin[];
    active?: boolean;
    is_indice?: boolean;
    values_indice: any;
    image_route: string;

}
