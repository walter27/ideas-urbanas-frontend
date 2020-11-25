import { Region } from './regions.model';
import { Word } from './wordTag.model';


export interface Tag {
    _id: string;
    obj_Canton: Region;
    obj_Word: Word;
    count: number;
}

