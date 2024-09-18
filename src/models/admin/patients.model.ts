import mongoose, { Schema, Document } from 'mongoose';

interface IPatient extends Document {
  name: string;
  email: string;
  mobileNumber: string;
  age: number;
  gender: string;
  address: string;
  medicalHistory: string;
}

const PatientSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  medicalHistory: { type: String, required: false },
}, { timestamps: true });

const Patient = mongoose.model<IPatient>('Patient', PatientSchema);

export default Patient;
