export function sendJson(res, statusCode, requestID, payload) {
  return res
  .status(statusCode)  
  .set({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0"
  }).json({
    requestId : requestID,
    success: true,
    data: payload});
}