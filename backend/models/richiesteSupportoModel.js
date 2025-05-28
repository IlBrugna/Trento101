import mongoose from 'mongoose';

const richiestaSupportoSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requesterEmail: {
      type: String,
      required: true,
    },
    is_company: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      enum: ['aperto', 'in_corso', 'risolto', 'chiuso'],
      default: 'aperto',
    },
    priority: {
      type: String,
      enum: ['basso', 'medio', 'alto', 'urgente'],
      default: 'medio',
    },
  },
  { timestamps: true }
);

const richiesteSupportoModel = mongoose.model('RichiesteSupporto', richiestaSupportoSchema);

export default richiesteSupportoModel;