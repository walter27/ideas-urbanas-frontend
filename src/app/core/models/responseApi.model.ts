export interface ResponseApi<T> {
    code: string;
    message: string;
    results: T;
}
