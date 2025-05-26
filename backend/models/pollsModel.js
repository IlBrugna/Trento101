const mongoose = require('mongoose');
const { Schema } = mongoose;

const OptionSchema = new Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
});

const PollSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  options: [OptionSchema],
  votedIps: [String], // IP LIST DI CHI HA GIà
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ['attivo', 'chiuso'],
    default: 'attivo'
  }
}, { timestamps: true });

module.exports = mongoose.model('Polls', PollSchema);