import companyModel from "../models/companyModel.js"; // IMPORTA IL MODELLO
export const Login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const company = await companyModel.findOne({ email }).select('+password');
        if (!company) {
            return res.status(404).json({message: 'Azienda non trovata'});
        }
        const isMatch = (password === company.password);
        if (!isMatch) {
            return res.status(401).json({message: 'Password errata'});
        }
        const {password: pass, ...companyData} = company._doc; //DESTRUTTURAZIONE PER NON RITORNARE LA PASSWORDspieg
    
        res.cookie('AuthToken', company.generateAuthToken(), {
            maxAge: 30 * 60 * 1000, //BROWSER CANCELLA DOPO X MILLISECONDI
            httpOnly: true, // IMPEDISCE A CLIENT JAVASCRIPT DI MOFICIARLO
            secure: true, //FORZA HTTPS
            sameSite: 'None', //vanno bene richieste cross site
        });

        return res.status(200).json({message: 'Login effettuato con successo', companyData});

    } catch (error) {
        return res.status(500).json({ message: 'Errore durante il recupero dell\'azienda'});
    }
    res.end();
}

export const logout = async (req, res) => {
    res.clearCookie('AuthToken'); //CANCELLA IL COOKIE
    return res.status(200).json({message: 'Logout effettuato con successo'});
}; //ROUTE DI LOGOUT

export const checkEmailExists = async (req, res) => {
    const email = req.params.email;
    try {
        const company = await companyModel.findOne( {email} );
        if (company) {
            return res.status(200).json({ exists: true });
        }
        else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error checking email' });
    }
}