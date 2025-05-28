import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'page_view',
        'login',
        'logout',
        'support_request_created',
        'company_created',
        'survey_vote',
        'service_click',
      ],
    },

    /** URL o rotta interessata (`/`, `/aziende/123`, …) */
    url: {
      type: String,
      required: false,
    },

    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  {
    timestamps: true,
  }
);
// ricerche più frequenti: per tipo di evento nel tempo
eventSchema.index({ type: 1, createdAt: 1 });

// per analizzare gli accessi di un singolo utente
eventSchema.index({ userId: 1, createdAt: 1 });

eventSchema.statics.log = function (payload) {
  return this.create(payload);
};

const eventModel = mongoose.model('events', eventSchema);

export default eventModel;
