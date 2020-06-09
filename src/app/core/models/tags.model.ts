import { Region } from './regions.model';

export interface Tag {
    _id: string;
    text: string;
    obj_Canton: Region;
    count: number;
} 

