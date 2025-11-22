import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/utils/validation";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { selectIsAuthenticated } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { initializeCsrfProtection } from "@/redux/api/baseApi";
import { extractAuthError } from "@/redux/api/apiUtils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { FullScreenLoader } from "@/components/ui/full-screen-loader";
import { toast } from "sonner";

const Register = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      c_password: "",
      address_line_1: "",
      address_line_2: "",
      address_line_3: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await initializeCsrfProtection();
      const result = await register(data).unwrap();
      toast.success(result.message || "Registration successful!");
    } catch (error: unknown) {
      // SRS 12.2: Use centralized error utilities
      const errorMessage = extractAuthError(error);
      toast.error("Registration Failed", { description: errorMessage });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <FullScreenLoader isLoading={isLoading} message="Registracija u toku..." />
      <div className={cn("flex flex-col gap-6 w-full max-w-md")}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Registracija</CardTitle>
            <CardDescription>Kreirajte novi nalog</CardDescription>
          </CardHeader>
          <CardContent>
            <Form onSubmit={form.handleSubmit(onSubmit)} role="form">
              <div className="grid gap-4">
                {/* Ime */}
                <FormField>
                  <FormLabel htmlFor="name">Ime *</FormLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Vaše ime"
                    autoComplete="name"
                    {...form.register("name")}
                    disabled={isLoading}
                  />
                  {form.formState.errors.name && (
                    <FormMessage>{form.formState.errors.name.message}</FormMessage>
                  )}
                </FormField>

                {/* Email */}
                <FormField>
                  <FormLabel htmlFor="email">Email *</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="vas@email.com"
                    autoComplete="email"
                    {...form.register("email")}
                    disabled={isLoading}
                  />
                  {form.formState.errors.email && (
                    <FormMessage>{form.formState.errors.email.message}</FormMessage>
                  )}
                </FormField>

                {/* Lozinka */}
                <FormField>
                  <FormLabel htmlFor="password">Lozinka *</FormLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Unesite lozinku"
                    autoComplete="new-password"
                    {...form.register("password")}
                    disabled={isLoading}
                  />
                  {form.formState.errors.password && (
                    <FormMessage>{form.formState.errors.password.message}</FormMessage>
                  )}
                </FormField>

                {/* Potvrda lozinke */}
                <FormField>
                  <FormLabel htmlFor="c_password">Potvrdite lozinku *</FormLabel>
                  <Input
                    id="c_password"
                    type="password"
                    placeholder="Ponovite lozinku"
                    autoComplete="new-password"
                    {...form.register("c_password")}
                    disabled={isLoading}
                  />
                  {form.formState.errors.c_password && (
                    <FormMessage>{form.formState.errors.c_password.message}</FormMessage>
                  )}
                </FormField>

                {/* Telefon */}
                <FormField>
                  <FormLabel htmlFor="phone">Telefon</FormLabel>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+381 XX XXX XXXX"
                    autoComplete="tel"
                    {...form.register("phone")}
                    disabled={isLoading}
                  />
                </FormField>

                {/* Adresa */}
                <FormField>
                  <FormLabel htmlFor="address_line_1">Adresa</FormLabel>
                  <Input
                    id="address_line_1"
                    type="text"
                    placeholder="Ulica i broj"
                    autoComplete="address-line1"
                    {...form.register("address_line_1")}
                    disabled={isLoading}
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    id="address_line_2"
                    type="text"
                    placeholder="Grad"
                    autoComplete="address-line2"
                    {...form.register("address_line_2")}
                    disabled={isLoading}
                  />
                  <Input
                    id="address_line_3"
                    type="text"
                    placeholder="Poštanski broj"
                    autoComplete="postal-code"
                    {...form.register("address_line_3")}
                    disabled={isLoading}
                  />
                </div>

                {/* Submit button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Registracija u toku..." : "Registruj se"}
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          Već imate nalog?{" "}
          <Link to="/login" className="underline underline-offset-4 hover:text-primary">
            Prijavite se
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
