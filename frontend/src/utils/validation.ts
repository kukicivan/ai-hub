import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Unesite validnu email adresu"),
  password: z.string().min(6, "Lozinka mora imati najmanje 6 karaktera"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const profileSchema = z.object({
  name: z.string().min(2, "Ime je obavezno"),
  email: z.string().email("Unesite validnu email adresu"),
  phone: z.string().optional(),
  bio: z.string().max(200, "Biografija može imati maksimalno 200 karaktera").optional(),
  address_line_1: z.string().optional(),
  address_line_2: z.string().optional(),
  address_line_3: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(6, "Trenutna lozinka je obavezna"),
    newPassword: z.string().min(6, "Nova lozinka mora imati najmanje 6 karaktera"),
    confirmPassword: z.string().min(6, "Potvrdite novu lozinku"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Lozinke se ne podudaraju",
    path: ["confirmPassword"],
  });

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Ime mora imati najmanje 2 karaktera"),
    email: z.string().email("Unesite validnu email adresu"),
    password: z.string().min(8, "Lozinka mora imati najmanje 8 karaktera"),
    c_password: z.string().min(8, "Potvrdite lozinku"),
    address_line_1: z.string().optional(),
    address_line_2: z.string().optional(),
    address_line_3: z.string().optional(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.c_password, {
    message: "Lozinke se ne podudaraju",
    path: ["c_password"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// User Management Schemas
export const createUserSchema = z
  .object({
    name: z.string().min(2, "Ime mora imati najmanje 2 karaktera"),
    email: z.string().email("Unesite validnu email adresu"),
    password: z.string().min(8, "Lozinka mora imati najmanje 8 karaktera"),
    password_confirmation: z.string().min(8, "Potvrdite lozinku"),
    user_type_id: z.number({ required_error: "Tip korisnika je obavezan" }).min(1, "Odaberite tip korisnika"),
    phone: z.string().optional(),
    bio: z.string().max(1000, "Biografija može imati maksimalno 1000 karaktera").optional(),
    address_line_1: z.string().max(255).optional(),
    address_line_2: z.string().max(255).optional(),
    address_line_3: z.string().max(255).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    postal_code: z.string().max(20).optional(),
    country: z.string().max(100).optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Lozinke se ne podudaraju",
    path: ["password_confirmation"],
  });

export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(2, "Ime mora imati najmanje 2 karaktera"),
  email: z.string().email("Unesite validnu email adresu"),
  user_type_id: z.number({ required_error: "Tip korisnika je obavezan" }).min(1, "Odaberite tip korisnika"),
  phone: z.string().max(20).optional().nullable(),
  bio: z.string().max(1000, "Biografija može imati maksimalno 1000 karaktera").optional().nullable(),
  address_line_1: z.string().max(255).optional().nullable(),
  address_line_2: z.string().max(255).optional().nullable(),
  address_line_3: z.string().max(255).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  postal_code: z.string().max(20).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Lozinka mora imati najmanje 8 karaktera"),
    password_confirmation: z.string().min(8, "Potvrdite lozinku"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Lozinke se ne podudaraju",
    path: ["password_confirmation"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
