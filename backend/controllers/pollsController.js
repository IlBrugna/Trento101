import pollsModel from '../models/pollsModel.js';
import XLSX from 'xlsx';
import { recordEvent } from '../utils/recordEventUtils.js';
import { logAction, recordPollCreation } from '../utils/logUtils.js';

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
        
        await recordPollCreation(req, newPoll._id.toString(), req.user?._id, req.user?.email);
        
        res.status(201).json(newPoll);
    } catch (error) {
        await logAction(req, 'poll_creation_failed', { 
            status: 'error',
            details: { error: error.message }
        });
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

export const getDownloadPolls = async (req, res) => {
    try {
        const format = req.query.format || 'json';
        const polls = await pollsModel.find({}).sort({ createdAt: -1 });
        
        const exportData = polls.map(poll => ({
            id: poll._id,
            title: poll.title,
            description: poll.description || '',
            totalVotes: poll.options.reduce((sum, opt) => sum + opt.votes, 0),
            options: poll.options.map(opt => `${opt.text} (${opt.votes} voti)`).join('; '),
            status: poll.status,
            startDate: poll.startDate ? poll.startDate.toISOString() : '',
            endDate: poll.endDate ? poll.endDate.toISOString() : '',
            createdAt: poll.createdAt.toISOString(),
            updatedAt: poll.updatedAt.toISOString()
        }));

        if (format === 'json') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', 'attachment; filename="sondaggi.json"');
            res.json({
                exportDate: new Date().toISOString(),
                totalPolls: polls.length,
                polls: exportData
            });
        } 
        else if (format === 'csv') {
            const headers = ['ID', 'Titolo', 'Descrizione', 'Voti Totali', 'Opzioni', 'Status', 'Data Inizio', 'Data Fine', 'Creato', 'Aggiornato'];
            const csvRows = [headers.join(',')];
            
            exportData.forEach(poll => {
                const row = [
                    poll.id,
                    `"${poll.title.replace(/"/g, '""')}"`,
                    `"${poll.description.replace(/"/g, '""')}"`,
                    poll.totalVotes,
                    `"${poll.options.replace(/"/g, '""')}"`,
                    poll.status,
                    poll.startDate,
                    poll.endDate,
                    poll.createdAt,
                    poll.updatedAt
                ];
                csvRows.push(row.join(','));
            });
            
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="sondaggi.csv"');
            res.send(csvRows.join('\n'));
        }
        else if (format === 'excel') {
            const worksheet = XLSX.utils.json_to_sheet(exportData.map(poll => ({
                'ID': poll.id,
                'Titolo': poll.title,
                'Descrizione': poll.description,
                'Voti Totali': poll.totalVotes,
                'Opzioni': poll.options,
                'Status': poll.status,
                'Data Inizio': poll.startDate,
                'Data Fine': poll.endDate,
                'Creato': poll.createdAt,
                'Aggiornato': poll.updatedAt
            })));
            
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sondaggi');
            
            const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
            
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename="sondaggi.xlsx"');
            res.send(buffer);
        }
        else {
            return res.status(400).json({ message: 'Formato non supportato' });
        }
        
        // Log successful download
        await logAction(req, 'polls_download', {
            details: { format, pollsCount: polls.length }
        });
        
    } catch (error) {
        console.error('Download error:', error);
        await logAction(req, 'polls_download_failed', {
            status: 'error',
            details: { error: error.message, format: req.query.format }
        });
        res.status(500).json({ message: 'Errore durante l\'esportazione dei sondaggi' });
    }
};

export const putPoll = async (req, res) => {
    try {
        const { pollId } = req.params;
        const { status } = req.body;
        if (!['attivo', 'chiuso'].includes(status)) {
            return res.status(400).json({ message: 'Status non valido' });
        }
        const poll = await pollsModel.findByIdAndUpdate(
            pollId,
            { status },
            { new: true }
        );
        if (!poll) {
            return res.status(404).json({ message: 'Sondaggio non trovato' });
        }
        res.status(200).json(poll);
    } catch (error) {
        res.status(500).json({ message: "Errore durante l'aggiornamento dello status" });
    }
};
