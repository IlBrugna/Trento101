import mongoose from 'mongoose';

const richiestaSupportoAziendaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  problema: {
    type: String,
    required: true,
  },
  descrizione: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['bassa', 'media', 'alta'],
    default: 'media',
  },
  status: {
    type: String,
    enum: ['in_attesa', 'in_corso', 'risolto'],
    default: 'in_attesa',
  },
  lastReplyAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

const supportRequestAziendaModel = mongoose.model('supportRequestAzienda', richiestaSupportoAziendaSchema);

export default supportRequestAziendaModel;
