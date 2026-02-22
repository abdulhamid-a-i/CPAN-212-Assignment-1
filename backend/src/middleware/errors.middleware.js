export const errorHandler = (err, req, res, next) => {
    const requestID = req.requestId
    const statusCode = err.statusCode || 500;
    const code = err.code || 'INTERNAL_ERROR';
    const message = err.message;
    const details = err.details;
    
    res.status(statusCode).json({
        requestId: requestID,
        success: false,
        error: {
            code: code,
            message: message,
            detials: details
        }
    });

}
