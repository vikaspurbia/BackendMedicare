import { Request, Response } from 'express';
import User from '../../models/admin/user.model';
import Role from '../../models/admin/role.model';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

// Zod schema for user creation and login validation
const userSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  roleName: z.string().min(1, "Role name is required"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const createUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const validation = userSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validation.error.errors,
        success: false,
      });
    }

    const { username, email, password, roleName } = validation.data;
    const role = await Role.findOne({ name: roleName });

    if (!role) {
      return res.status(404).json({
        message: "Role not found",
        success: false,
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const newUser = new User({
      username,
      email,
      password, // plain text password will be hashed by the `pre-save` hook
      role: role._id, // This should be an ObjectId
      isActive: true,
    });
    
    await newUser.save();

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: roleName,
        isActive: newUser.isActive,
      },
      success: true,
    });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({
      message: "Unable to create user",
      success: false,
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validation.error.errors,
        success: false,
      });
    }

    const { email, password } = validation.data;
    const user = await User.findOne({ email });
    if (!user) {
      console.error("User not found:", email);
      return res.status(400).json({
        message: "Invalid Username",
        success: false,
      });
    }

    // Use the comparePassword method defined in the schema
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.error("Password mismatch for user:", email);
      return res.status(400).json({
        message: "Invalid password",
        success: false,
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      success: true,
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({
      message: "Unable to login",
      success: false,
    });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await User.find().populate('role','admin');
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({
      message: "Unable to fetch users",
      success: false,
    });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate('role','admin');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({
      message: "Unable to fetch user",
      success: false,
    });
  }
};
export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { username, email, roleName, isActive } = req.body; // Include roleName in the body

    const validation = userSchema.safeParse({ username, email, roleName, password: '123456' });
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validation.error.errors,
        success: false,
      });
    }

    // Fetch role by roleName
    const roleExists = await Role.findOne({ name: roleName });
    if (!roleExists) {
      return res.status(404).json({
        message: "Role not found",
        success: false,
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email, role: roleExists._id, isActive }, // Update role by role ID
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({
      message: "Unable to update user",
      success: false,
    });
  }
};


export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({
      message: "Unable to delete user",
      success: false,
    });
  }
};
