import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  email: string;
  mobileNumber: string;
  specialization: string;
  qualifications: string[];
  experience: number; // years
  availability: {
    days: string[];
    timeSlots: string[];
  };
}

const DoctorSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: true },
    specialization: { type: String, required: true },
    qualifications: { type: [String], required: true },
    experience: { type: Number, required: true },
    availability: {
      days: { type: [String], required: true },
      timeSlots: { type: [String], required: true }
    }
  },
  { timestamps: true }
);

export default mongoose.model<IDoctor>('Doctor', DoctorSchema);
