import { Request, Response } from 'express';
import Role from '../../models/admin/role.model';
import { z } from 'zod';

// Zod schema for role creation validation
const roleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
});

// Controller for creating a new role
export const createRole = async (req: Request, res: Response): Promise<Response> => {
  try {
    const validation = roleSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validation.error.errors,
        success: false,
      });
    }

    const { name } = validation.data;
    const roleExists = await Role.findOne({ name });

    if (roleExists) {
      return res.status(400).json({
        message: "Role already exists",
        success: false,
      });
    }

     const newRole = new Role({ name, isActive: true });
    await newRole.save();

    return res.status(201).json({
      message: "Role created successfully",
      role: newRole,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to create role",
      success: false,
    });
  }
};
