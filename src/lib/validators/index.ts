import { z } from "zod";

// --- Auth Validators ---
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .max(255, "Email must be less than 255 characters"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

// --- Trip Validators ---
export const tripSchema = z
  .object({
    name: z
      .string()
      .min(1, "Trip name is required")
      .max(150, "Trip name must be less than 150 characters"),
    description: z
      .string()
      .max(2000, "Description must be less than 2000 characters")
      .optional()
      .or(z.literal("")),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return new Date(data.end_date) >= new Date(data.start_date);
      }
      return true;
    },
    {
      message: "End date must be on or after start date",
      path: ["end_date"],
    }
  );

// --- Trip Stop Validators ---
export const tripStopSchema = z
  .object({
    city_id: z.string().uuid("Please select a valid city"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return new Date(data.end_date) >= new Date(data.start_date);
      }
      return true;
    },
    {
      message: "End date must be on or after start date",
      path: ["end_date"],
    }
  );

// --- Packing Item Validators ---
export const packingItemSchema = z.object({
  item_name: z
    .string()
    .min(1, "Item name is required")
    .max(200, "Item name must be less than 200 characters"),
  category: z.string().min(1, "Category is required"),
});

// --- Trip Note Validators ---
export const tripNoteSchema = z.object({
  content: z
    .string()
    .min(1, "Note content is required")
    .max(5000, "Note must be less than 5000 characters"),
  trip_stop_id: z.string().uuid().optional().or(z.literal("")),
});

// Export inferred types
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type TripFormData = z.infer<typeof tripSchema>;
export type TripStopFormData = z.infer<typeof tripStopSchema>;
export type PackingItemFormData = z.infer<typeof packingItemSchema>;
export type TripNoteFormData = z.infer<typeof tripNoteSchema>;
