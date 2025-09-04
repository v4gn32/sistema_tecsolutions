// src/middlewares/role.middleware.js
// Restringe acesso por papel (Role). Ex.: onlyRoles('ADMIN')

export function onlyRoles(...roles) {
  return (req, res, next) => {
    const role = req.userRole;
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }
    next();
  };
}
