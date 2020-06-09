export interface Region {
    _id: string;
    name: string;
    description: string;
    obj_Provincia: Region;
    obj_Canton: Region;
    active?: boolean;
    url?: string;
    extraData?:any;
    color?:string;
}

