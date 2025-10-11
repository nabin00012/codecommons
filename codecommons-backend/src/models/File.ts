import mongoose, { Document, Schema } from "mongoose";

export interface IFile extends Document {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  uploadedBy: mongoose.Types.ObjectId;
  type: 'assignment_attachment' | 'submission_attachment' | 'material' | 'profile_image' | 'course_material';
  relatedId?: mongoose.Types.ObjectId; // Assignment, Submission, Course, or User ID
  isPublic: boolean;
  downloadCount: number;
  expiresAt?: Date;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number; // for videos/audio
    encoding?: string;
    quality?: string;
  };
  tags: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FileSchema: Schema<IFile> = new Schema({
  filename: {
    type: String,
    required: [true, 'Filename is required'],
    trim: true
  },
  originalName: {
    type: String,
    required: [true, 'Original name is required'],
    trim: true
  },
  mimetype: {
    type: String,
    required: [true, 'MIME type is required'],
    trim: true
  },
  size: {
    type: Number,
    required: [true, 'File size is required'],
    min: [1, 'File size must be greater than 0']
  },
  path: {
    type: String,
    required: [true, 'File path is required'],
    trim: true
  },
  url: {
    type: String,
    required: [true, 'File URL is required'],
    trim: true
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader ID is required']
  },
  type: {
    type: String,
    enum: ['assignment_attachment', 'submission_attachment', 'material', 'profile_image', 'course_material'],
    required: [true, 'File type is required']
  },
  relatedId: {
    type: Schema.Types.ObjectId,
    refPath: 'type', // Dynamic reference based on type
    required: function() {
      return ['assignment_attachment', 'submission_attachment', 'course_material'].includes(this.type);
    }
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  downloadCount: {
    type: Number,
    default: 0,
    min: 0
  },
  expiresAt: {
    type: Date
  },
  metadata: {
    width: Number,
    height: Number,
    duration: Number,
    encoding: String,
    quality: String
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Indexes for better performance
FileSchema.index({ uploadedBy: 1, createdAt: -1 });
FileSchema.index({ type: 1, relatedId: 1 });
FileSchema.index({ isPublic: 1 });
FileSchema.index({ tags: 1 });
FileSchema.index({ mimetype: 1 });

// Virtual for file extension
FileSchema.virtual('extension').get(function() {
  return this.originalName.split('.').pop()?.toLowerCase() || '';
});

// Virtual for file category based on mimetype
FileSchema.virtual('category').get(function() {
  const mime = this.mimetype.toLowerCase();
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  if (mime.includes('pdf')) return 'document';
  if (mime.includes('document') || mime.includes('word')) return 'document';
  if (mime.includes('spreadsheet') || mime.includes('excel')) return 'spreadsheet';
  if (mime.includes('presentation') || mime.includes('powerpoint')) return 'presentation';
  if (mime.includes('zip') || mime.includes('rar') || mime.includes('7z')) return 'archive';
  if (mime.includes('text/')) return 'text';
  return 'other';
});

// Virtual for checking if file is expired
FileSchema.virtual('isExpired').get(function() {
  return this.expiresAt && new Date() > this.expiresAt;
});

// Method to increment download count
FileSchema.methods.incrementDownloadCount = function(): Promise<IFile> {
  this.downloadCount += 1;
  return this.save();
};

// Method to check if user can access file
FileSchema.methods.canUserAccess = function(userId: mongoose.Types.ObjectId, userRole?: string): boolean {
  if (this.isPublic) return true;
  if (this.uploadedBy.equals(userId)) return true;

  // Teachers can access student submissions for their assignments
  if (this.type === 'submission_attachment' && userRole === 'teacher') {
    return true; // Simplified for now
  }

  return false;
};

// Pre-save middleware to generate URL if not provided
FileSchema.pre('save', function(next) {
  if (!this.url && this.path) {
    // In a real application, you'd construct the URL based on your file serving setup
    this.url = `/uploads/${this.filename}`;
  }
  next();
});

// Pre-remove middleware to delete physical file
FileSchema.pre('deleteOne', function (next) {
  // In a real application, you'd delete the physical file from disk/cloud storage
  console.log(`File ${(this as any).filename} is being removed`);
  next();
});

export default mongoose.model<IFile>('File', FileSchema);

