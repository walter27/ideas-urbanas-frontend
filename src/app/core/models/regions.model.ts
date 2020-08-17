export interface Region {
    _id: string;
    code: string;
    name: string;
    description: string;
    obj_Provincia: Region;
    obj_Canton: Region;
    active?: boolean;
    covid: boolean;
    indexes: boolean;
    url?: string;
    extraData?: any;
    color?: string;
}

