import jwt from "jsonwebtoken";
import companyModel from "../models/companyModel.js";

const checkCompanyAuth = async (req,res,next) => {
    try {
        const token = req.cookies.AuthToken;
        if (!token) {
            return res.status(401).json({message: 'Token non fornito'});
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //RITORNA IL SOLO CAMPO DEL PAYLOAD
        const company = await companyModel.findById(decoded._id);
        if (!company) {
            return res.status(401).json({message: 'Token non valido'});
        } 
        req.company = company._doc;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') { return res.status(401).json({ message: 'Token scaduto' });}
        if (error.name === 'JsonWebTokenError') { return res.status(401).json({ message: 'Token non valido' });}
        return res.status(500).json({ message: error.message });
       }
    }
export default checkCompanyAuth;