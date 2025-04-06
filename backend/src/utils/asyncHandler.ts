import { Request, Response, NextFunction } from 'express';

/*
    For some reason if I don't resolve the promise before giving it to the router Jest acts up?
    However, the router is fine using the async routes?
*/
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};