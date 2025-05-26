import pollsModel from '../models/pollsModel.js';

export const postPoll = async (req, res) => {
    try {
        const { title, description, options, startDate, endDate } = req.body;

        if (!title || !options || !Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ message: 'Il titolo e almeno due opzioni sono obbligatori' });
        }

        const formattedOptions = options.map(opt => ({
        text: opt.text,
        votes: 0
        }));

        const newPoll = new pollsModel({
        title,
        description,
        options: formattedOptions,
        startDate,
        endDate,
        status: 'attivo',
        votedIps: []
        });

        await newPoll.save();

        res.status(201).json(newPoll);
    } catch (error) {
        res.status(500).json({ message: 'Errore durante la creazione del sondaggio' });
    }
}