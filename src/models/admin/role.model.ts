import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Role document
export interface IRole extends Document {
  name: string;
  isActive: boolean;
}

// Define the Role schema
const RoleSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true }, // Role name (e.g., "admin", "user")
    isActive: { type: Boolean, default: true },           // Whether the role is active
  },
  { timestamps: true } // Automatically add `createdAt` and `updatedAt` fields
);

// Create and export the Role model
export default mongoose.model<IRole>('Role', RoleSchema);
