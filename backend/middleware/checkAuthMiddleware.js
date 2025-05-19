import jwt from "jsonwebtoken";
import companyModel from "../models/companiesModel.js";
import adminModel from "../models/adminModel.js"; // <-- Assicurati di crearlo e importarlo

const checkAuth = (requiredRole = null) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.AuthToken;
      if (!token) {
        return res.status(401).json({ message: 'Token non fornito' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { _id, role } = decoded;

      if (requiredRole && role !== requiredRole) {
        return res.status(403).json({ message: 'Accesso non autorizzato' });
      }

      let user;
      if (role === 'company') {
        user = await companyModel.findById(_id);
      } else if (role === 'admin') {
        user = await adminModel.findById(_id);
      } else {
        return res.status(401).json({ message: 'Ruolo non riconosciuto' });}

      if (!user) {
        return res.status(401).json({ message: 'Utente non trovato' });}

      req.user = user._doc;
      req.role = role;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token scaduto' });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Token non valido' });
      }
      return res.status(500).json({ message: error.message });
    }
  };
};

export default checkAuth;
