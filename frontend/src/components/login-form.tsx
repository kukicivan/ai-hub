import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/utils/validation";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { selectIsAuthenticated } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { initializeCsrfProtection } from "@/redux/api/baseApi";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { FullScreenLoader } from "@/components/ui/full-screen-loader";
import { toast } from "sonner";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [login, { isLoading }] = useLoginMutation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (isAuthenticated) {
      type LocationState = { from: { pathname: string } };
      const from = (location.state as LocationState)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await initializeCsrfProtection();
      await login(data).unwrap();
      toast.success("Login successful!");
    } catch (error: unknown) {
      const apiError = error as {
        data?: { message?: string; errors?: Record<string, string[]> };
        status?: number;
      };
      // Handle Laravel validation errors format
      if (apiError?.data?.errors) {
        const firstField = Object.keys(apiError.data.errors)[0];
        const errorMessage = apiError.data.errors[firstField]?.[0] || "Validation failed";
        toast.error("Failed", { description: errorMessage });
      } else {
        const message = apiError?.data?.message || "Login failed. Please try again.";
        toast.error("Failed", { description: message });
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <FullScreenLoader isLoading={isLoading} message="Prijava u toku..." />
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Dobrodošli nazad</CardTitle>
          <CardDescription>Prijavite se na vaš nalog</CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={form.handleSubmit(onSubmit)} role="form">
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full" type="button" disabled>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Prijava putem Google-a
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Ili nastavite sa
                </span>
              </div>
              <div className="grid gap-6">
                <FormField>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="vas@email.com"
                    autoComplete="email"
                    {...form.register("email")}
                    disabled={isLoading}
                    required
                  />
                  {form.formState.errors.email && (
                    <FormMessage>{form.formState.errors.email.message}</FormMessage>
                  )}
                </FormField>
                <FormField>
                  <div className="flex items-center">
                    <FormLabel htmlFor="password">Lozinka</FormLabel>
                    <Link
                      to="/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Zaboravili ste lozinku?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    {...form.register("password")}
                    disabled={isLoading}
                    required
                  />
                  {form.formState.errors.password && (
                    <FormMessage>{form.formState.errors.password.message}</FormMessage>
                  )}
                </FormField>
                <Button type="submit" className="w-full" disabled={isLoading} aria-label="submit">
                  {isLoading ? "Prijava u toku..." : "Prijavite se"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Nemate nalog?{" "}
                <Link to="/register" className="underline underline-offset-4">
                  Registrujte se
                </Link>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        Klikom na dugme prihvatate naše <a href="#">Uslove korišćenja</a> i{" "}
        <a href="#">Politiku privatnosti</a>.
      </div>
    </div>
  );
}
