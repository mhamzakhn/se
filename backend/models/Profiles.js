// models/Profiles.js
import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  _id: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true  // ensure uniqueness
  },
  name: { 
    type: String, 
    required: true 
  },
  password_hash: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String 
  },
  student_status: { 
    type: String, 
    enum: ['student', 'non-student'],  
    default: 'non-student'
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'],  
    default: 'user'
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export default mongoose.model('Profile', profileSchema);
