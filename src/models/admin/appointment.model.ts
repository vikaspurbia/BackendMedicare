import mongoose, { Schema, Document, model } from 'mongoose';

export interface IAppointment extends Document {
  name: string;
  email: string;
  mobileNumber: string;
  adharNo: string;
  gender: string;
  date: Date;
  time: string;
  reason: string;
}

const AppointmentSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    adharNo: { type: String, required: true },
    gender: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    reason: { type: String, required: true },
  },
  { timestamps: true }
);

const Appointment = model<IAppointment>('Appointment', AppointmentSchema);

export default Appointment;
