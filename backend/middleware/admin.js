export const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next(); // User is admin, proceed
    } else {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};
