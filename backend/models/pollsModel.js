import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
});

const PollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  options: [OptionSchema], 
  votedIps: [String], // IP LIST DI CHI HA GIà VOTATO
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ['attivo', 'chiuso'],
    default: 'attivo'
  }
}, { timestamps: true });

const pollsModel = mongoose.model('Polls', PollSchema);

export default pollsModel;