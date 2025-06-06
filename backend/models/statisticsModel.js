import mongoose from 'mongoose';

const statisticsSchema = new mongoose.Schema({
  totalLogins: { type: Number, default: 0 },
  totalLogouts: { type: Number, default: 0 },
  totalSupportRequests: { type: Number, default: 0 },
  totalCompaniesCreated: { type: Number, default: 0 },
  totalSurveyVotes: { type: Number, default: 0 },
  pageViews: { type: Map, of: Number, default: new Map() },
  serviceClicks: { type: Map, of: Number, default: new Map() },
  universitaServiceClicks: { type: Map, of: Number, default: new Map() }
}, { timestamps: true });

statisticsSchema.statics.incrementCounter = async function(type, url = null, serviceId = null) {
  await this.findOneAndUpdate({}, {}, { upsert: true });
  
  let updateQuery = {};
 
  switch(type) {
    case 'login':
      updateQuery = { $inc: { totalLogins: 1 } };
      break;
    case 'logout':
      updateQuery = { $inc: { totalLogouts: 1 } };
      break;
    case 'support_request_created':
      updateQuery = { $inc: { totalSupportRequests: 1 } };
      break;
    case 'company_created':
      updateQuery = { $inc: { totalCompaniesCreated: 1 } };
      break;
    case 'survey_vote':
      updateQuery = { $inc: { totalSurveyVotes: 1 } };
      break;
    case 'page_view':
      updateQuery = { $inc: { [`pageViews.${url}`]: 1 } };
      //updateQuery = { $unset: { pageViews: "" } };
      break;
    case 'service_click':
      updateQuery = { $inc: { [`serviceClicks.${serviceId}`]: 1 } };
      break;
    case 'universita_service_click':
      updateQuery = { $inc: { [`universitaServiceClicks.${serviceId}`]: 1 } };
      break;
  }
 
  return this.findOneAndUpdate({}, updateQuery, { new: true });
};

const Statistics = mongoose.model('Statistics', statisticsSchema);
export default Statistics;