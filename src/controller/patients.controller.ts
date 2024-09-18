import { Request, Response } from 'express';
import { z } from 'zod';
import Patient from '../models/admin/patients.model';

// Zod schemas for validation
const patientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  mobileNumber: z.string().min(10, 'Mobile number must be at least 10 characters long'),
  age: z.number().int().positive('Age must be a positive number'),
  gender: z.string().min(1, 'Gender is required'),
  address: z.string().min(1, 'Address is required'),
  medicalHistory: z.string().optional(),
});

const patientIdSchema = z.object({
  id: z.string().length(24, 'Invalid ID format'), // MongoDB ObjectId is 24 characters long
});

// Type guard for error handling
const isErrorWithMessage = (error: unknown): error is { message: string } => {
  return (error as { message: string }).message !== undefined;
};

// Create a new patient
export const createPatient = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const parsedBody = patientSchema.parse(req.body);

    const patient = new Patient(parsedBody);
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    if (isErrorWithMessage(error)) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

// Get all patients
export const getPatients = async (req: Request, res: Response) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    if (isErrorWithMessage(error)) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Get a patient by ID
export const getPatientById = async (req: Request, res: Response) => {
  try {
    // Validate request params
    const { id } = patientIdSchema.parse(req.params);

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json(patient);
  } catch (error) {
    if (isErrorWithMessage(error)) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Update a patient by ID
export const updatePatient = async (req: Request, res: Response) => {
  try {
    // Validate request params and body
    const { id } = patientIdSchema.parse(req.params);
    const updatedData = patientSchema.partial().parse(req.body); // Use partial() for partial updates

    const patient = await Patient.findByIdAndUpdate(id, updatedData, { new: true });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json(patient);
  } catch (error) {
    if (isErrorWithMessage(error)) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

// Delete a patient by ID
export const deletePatient = async (req: Request, res: Response) => {
  try {
    // Validate request params
    const { id } = patientIdSchema.parse(req.params);

    const patient = await Patient.findByIdAndDelete(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    if (isErrorWithMessage(error)) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};
