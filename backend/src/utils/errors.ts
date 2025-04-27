export enum ErrorMessages {
    INVALID_TOKEN = 'Invalid or expired token',
    NO_TOKEN = "No token provided",
}

/**
 * todo: make error return a consistent json:
 * {
 *     "error": {
 *         "message":"error message here"
 *     }
 * }
 */