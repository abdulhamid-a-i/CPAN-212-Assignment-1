export class AppError extends Error {
    constructor(statusCode, code, message, details = []){
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.message = message;
        this.details = Array.isArray(details) ? details : [details];
    }
}