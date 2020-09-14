import { Region } from './regions.model';

export interface Research {
    _id: string;
    title: string;
    author: string;
    year: string;
    link: string;
    category: string;
    image_contentType: string;
    image_route: string;
    obj_Parroquia: Region;
    active: boolean;
}
