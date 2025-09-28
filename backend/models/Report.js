import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a report title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['infrastructure', 'health', 'education', 'agriculture', 'other']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    district: String,
    tehsil: String,
    village: String
  },
  reportedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  images: [{
    filename: String,
    originalName: String,
    path: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  resolutionNotes: String,
  resolvedAt: Date
}, {
  timestamps: true
});

// Index for location-based queries
reportSchema.index({ location: '2dsphere' });
reportSchema.index({ category: 1, status: 1 });
reportSchema.index({ createdAt: -1 });

export default mongoose.model('Report', reportSchema);