import mongoose from 'mongoose';

const mapDataSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['point', 'polygon', 'line']
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    required: true,
    enum: [
      'healthcare', 'education', 'infrastructure', 
      'agriculture', 'transport', 'administration', 'other'
    ]
  },
  coordinates: {
    type: [Number], // [longitude, latitude] for point
    index: '2dsphere'
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point', 'Polygon', 'LineString'],
      required: true
    },
    coordinates: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  properties: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  district: String,
  tehsil: String,
  village: String,
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// 2dsphere index for geospatial queries
mapDataSchema.index({ geometry: '2dsphere' });
mapDataSchema.index({ category: 1, district: 1 });

export default mongoose.model('MapData', mapDataSchema);