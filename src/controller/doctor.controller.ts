import { Request, Response } from 'express';
import Doctor from '../models/doctor.model';
import { z } from 'zod';

// Zod schema for doctor validation
const doctorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  mobileNumber: z.string().min(10, "Mobile number is required"),
  specialization: z.string().min(1, "Specialization is required"),
  qualifications: z.array(z.string()).min(1, "At least one qualification is required"),
  experience: z.number().int().nonnegative("Experience must be a non-negative integer"),
  availability: z.object({
    days: z.array(z.string()).nonempty("At least one day is required"),
    timeSlots: z.array(z.string()).nonempty("At least one time slot is required")
  })
});

export const createDoctor = async (req: Request, res: Response): Promise<Response> => {
  try {
    const validation = doctorSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validation.error.errors,
        success: false,
      });
    }

    const { name, email, mobileNumber, specialization, qualifications, experience, availability } = validation.data;
    const newDoctor = new Doctor({
      name,
      email,
      mobileNumber,
      specialization,
      qualifications,
      experience,
      availability
    });
    await newDoctor.save();

    return res.status(201).json({
      message: "Doctor created successfully",
      doctor: newDoctor,
      success: true,
    });
  } catch (err) {
    console.error("Error creating doctor:", err);
    return res.status(500).json({
      message: "Unable to create doctor",
      success: false,
    });
  }
};

// Controller to get all doctors
export const getAllDoctors = async (req: Request, res: Response): Promise<Response> => {
  try {
    const doctors = await Doctor.find();
    return res.status(200).json({
      success: true,
      doctors,
    });
  } catch (err) {
    console.error("Error fetching doctors:", err);
    return res.status(500).json({
      message: "Unable to fetch doctors",
      success: false,
    });
  }
};

// Controller to get a doctor by ID
export const getDoctorById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }
    return res.status(200).json({
      success: true,
      doctor,
    });
  } catch (err) {
    console.error("Error fetching doctor:", err);
    return res.status(500).json({
      message: "Unable to fetch doctor",
      success: false,
    });
  }
};
// Controller to delete a doctor by ID
export const deleteDoctorById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const result = await Doctor.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting doctor:", err);
    return res.status(500).json({
      message: "Unable to delete doctor",
      success: false,
    });
  }
};
// Controller to update a doctor by ID
export const updateDoctorById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    // Validate and parse the update data
    const validation = doctorSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validation.error.errors,
        success: false,
      });
    }

    const updatedData = validation.data;

    const doctor = await Doctor.findByIdAndUpdate(id, updatedData, { new: true });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      doctor,
    });
  } catch (err) {
    console.error("Error updating doctor:", err);
    return res.status(500).json({
      message: "Unable to update doctor",
      success: false,
    });
  }
};