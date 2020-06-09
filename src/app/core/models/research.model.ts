import { Region } from './regions.model';

export interface Research {
    _id: string;
    description: string;
    image_contentType: string;
    image_route: string;
    obj_Parroquia: Region;
    hover:false;
}
