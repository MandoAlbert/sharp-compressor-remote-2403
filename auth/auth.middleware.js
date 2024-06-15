export default class AuthMiddleware {
  static validateTokenMiddleware(req, res, next) {
    // Check if 'token' exists in the request body
    if (!req.body || !req.body.token) {
      return res.status(401).json({ error: 'Unauthorized: Missing auth token' });
    }

    // Compare the token with the expected value
    if (req.body.token !== process.env.SERVICE_TOKEN) {
      return res.status(403).json({ error: 'Unauthorized: Invalid auth token' });
    }

    // Valid token, continue processing the request (call next())
    next();
  }
}
