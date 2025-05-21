const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    // Check for token in cookies
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // Check for token in Authorization header
    if (!token && req.header('Authorization') && req.header('Authorization').startsWith('Bearer ')) {
        token = req.header('Authorization').replace('Bearer ', '');
    }

    // If no token, send an error
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Try to verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user information to the request object
        req.user = decoded;

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = protect;
