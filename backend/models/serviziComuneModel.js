import mongoose from 'mongoose';

const comuneSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,  // "secondario" di default
      required: true,
    },
  },
  { timestamps: true }
);

const serviziComuneModel = mongoose.model('serviziComune', comuneSchema);

export default serviziComuneModel;