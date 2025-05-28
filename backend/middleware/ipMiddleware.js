export const ipMiddleware = (req, res, next) => {
  req.clientIP = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress;
  next();
};