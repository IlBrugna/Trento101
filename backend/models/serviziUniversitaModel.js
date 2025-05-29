import mongoose from 'mongoose';

const universitaSchema = new mongoose.Schema({
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
      default: false,  
      required: true,
    },
  },
  { timestamps: true }
);

const serviziUniversitaModel = mongoose.model('serviziUniversita', universitaSchema);

export default serviziUniversitaModel;