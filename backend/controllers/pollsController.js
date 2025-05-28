import pollsModel from '../models/pollsModel.js';
import { recordEvent } from '../utils/recordEventUtils.js';

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

export const getPolls = async (req, res) => {
    try {
        const allPolls = await pollsModel.find();
        // Aggiungi info se l'utente ha votato, ma rimuovi gli IP dalla risposta
        const pollsWithVoteStatus = allPolls.map(poll => {
            const pollObj = poll.toObject();
            pollObj.hasVoted = poll.votedIps.includes(req.clientIP);
            delete pollObj.votedIps;
            return pollObj;
        });
        return res.status(200).json(pollsWithVoteStatus);
    } catch (err) {
        return res.status(500).json({ message: 'Errore durante il recupero dei sondaggi' });
    }
};

export const postVote = async (req, res) => {
    try {
        const { pollId } = req.params;
        const { optionId } = req.body;

        const poll = await pollsModel.findById(pollId);
        if (!poll) {
            return res.status(404).json({ message: 'Sondaggio non trovato' });
        }

        // Controlla se ha già votato
        if (poll.votedIps.includes(req.clientIP)) {
            return res.status(400).json({ message: 'Hai già votato in questo sondaggio' });
        }
        const option = poll.options.id(optionId);
        if (!option) {
            return res.status(400).json({ message: 'Opzione non valida' });
        }

        option.votes += 1; //Incrementa voto
        poll.votedIps.push(req.clientIP);
        await poll.save();
        res.status(200).json({ message: 'Voto registrato con successo' });
    } catch (error) {
        res.status(500).json({ message: 'Errore durante il voto' });
    }
};