import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an alert title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Please add an alert message'],
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  type: {
    type: String,
    required: true,
    enum: ['info', 'warning', 'danger', 'success']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  targetAudience: {
    type: [String],
    enum: ['all', 'admin', 'moderator', 'user'],
    default: ['all']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  affectedAreas: [{
    district: String,
    tehsil: String,
    village: String
  }],
  actionRequired: {
    type: Boolean,
    default: false
  },
  actionUrl: String
}, {
  timestamps: true
});

// Index for active alerts and date ranges
alertSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
alertSchema.index({ type: 1, priority: 1 });

export default mongoose.model('Alert', alertSchema);