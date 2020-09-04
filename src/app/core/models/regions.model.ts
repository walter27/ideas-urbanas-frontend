export interface Region {
    _id: string;
    code: string;
    name: string;
    description: string;
    obj_Provincia: Region;
    obj_Canton: Region;
    is_intermediate?: boolean;
    covid?: boolean;
    active?: boolean;
    indexes?: boolean;
    url?: string;
    extraData?: any;
    color?: string;
}

