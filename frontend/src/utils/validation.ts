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
