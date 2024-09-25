import mongoose, { Schema, Document } from 'mongoose';

export interface IPatient extends Document {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  dob: string;
  gender: 'male' | 'female';
  address:string;
  medical:string;
}

const PatientSchema: Schema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: String, required: true, minlength: 10, maxlength: 15 },
    email: { type: String, required: true, unique: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true, enum: [  'male', 'female'] },
    address:  { type: String, required: true },
    medical:{ type: String, required: true },
  },
  { timestamps: true }
);

const Patient = mongoose.model<IPatient>('Patient', PatientSchema);

export default Patient;
