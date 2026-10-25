import { NextFunction, Request, Response } from "express";
import { DomainError } from "./DomainError";
import HTTP_STATUS from "./httpStatus";


// Ruta no coincide
export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Not found' });
};

// Manejo central de errores
export const errorHandler = (err: Error & { status?: number }, req: Request, res: Response, next: NextFunction): void => {
    // caso 1: se rompe una regla de negocio
    if (err instanceof DomainError) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ error: err.message });
        return;
    }
    // caso 2: error con status propio o fallo interno
    const status = err.status ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
    if (status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) console.error(err);
    res.status(status).json({
        error: status < HTTP_STATUS.INTERNAL_SERVER_ERROR ? err.message : 'Internal server error',
    });
};
