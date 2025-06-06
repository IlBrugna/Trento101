import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  action: { 
    type: String, 
    required: true,
    index: true // For faster queries
  },
  userEmail: { 
    type: String,
    sparse: true
  },
  ip: { 
    type: String,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed, // Flexible for any additional data
    default: null
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'error'],
    default: 'success'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true // For time-based queries
  }
}, { 
  timestamps: false, // We use custom timestamp to save space
  versionKey: false // Removes __v field to save space
});

// Compound index for efficient queries
LogSchema.index({ action: 1, timestamp: -1 });

const logModel = mongoose.model('Logs', LogSchema);
export default logModel;