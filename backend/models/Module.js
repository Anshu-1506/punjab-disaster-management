import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a module title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'Natural Disasters',
      'Fire Safety',
      'Medical Emergency',
      'Evacuation Procedures',
      'Communication Protocols',
      'First Aid',
      'General Preparedness'
    ]
  },
  type: {
    type: String,
    required: true,
    enum: ['pdf', 'video', 'youtube']
  },
  file: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String
  },
  youtubeUrl: {
    type: String,
    validate: {
      validator: function(v) {
        if (this.type === 'youtube') {
          return /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/.test(v);
        }
        return true;
      },
      message: 'Please provide a valid YouTube URL'
    }
  },
  uploadedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'inactive'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
moduleSchema.index({ category: 1, status: 1 });
moduleSchema.index({ createdAt: -1 });
moduleSchema.index({ type: 1 });

export default mongoose.model('Module', moduleSchema);