
export const Login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const company = await companyModel.findOne({ email}).select('+password');
        if (!company) {
            return res.status(404).json({message: 'Azienda non trovata'});
        }
        const isMatch = (password === company.password);
        if (!isMatch) {
            return res.status(401).json({message: 'Password errata'});
        }
        const {password: pass, ...companyData} = company._doc; //DESTRUTTURAZIONE PER NON RITORNARE LA PASSWORDspieg
        return res.status(200).json({message: 'Login effettuato con successo', companyData});

    } catch (error) {
        return res.status(500).json({ message: 'Errore durante il recupero dell\'azienda'});
    }
    res.end();
}