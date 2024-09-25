import { Request, Response } from 'express';
import Appointment from '../../models/admin/appointment.model';
import { z } from 'zod';

// Zod schema for appointment validation
const appointmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  mobileNumber: z.string().min(10, "Mobile number is required"),
  adharNo: z.string().min(12, "Aadhar number is required"),
  gender: z.string().min(1, "Gender is required"),
  date: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid date"),
  time: z.string().min(1, "Time is required"),
  reason: z.string().min(1, "Reason for appointment is required"),
});

export const createAppointment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const validation = appointmentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validation.error.errors,
        success: false,
      });
    }

    const { name, email, mobileNumber, adharNo, gender, date, time, reason } = validation.data;
    const newAppointment = new Appointment({
      name,
      email,
      mobileNumber,
      adharNo,
      gender,
      date: new Date(date),
      time,
      reason,
    });
    await newAppointment.save();

    return res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
      success: true,
    });
  } catch (err) {
    console.error("Error creating appointment:", err);
    return res.status(500).json({
      message: "Unable to create appointment",
      success: false,
    });
  }
};

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find({});
    res.json(appointments.map(app => ({ ...app.toObject(), id: app._id })));
    
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointment', error });
  }
};

// Update an appointment
export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedAppointment = await Appointment.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({message:'Appointment updated successfully'});
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment', error });
  }
};