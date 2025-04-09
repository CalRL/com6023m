interface Error {
    name: ErrorName;
    message: string;
    cause?: any;
}

type ErrorName =
    | 'NullError'
    | 'EnvError';

export class ServerError extends Error {
    name: ErrorName;
    message: string;
    cause: any;
    constructor({errorName: string, message: string, cause: any }): Error {
        super();
        this.name = errorName;
        this.message = message;
        this.cause = cause;
    }
}

/**
 * todo: make error return a consistent json:
 * {
 *     "error": {
 *         "message":"error message here"
 *     }
 * }
 */