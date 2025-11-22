import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useResetPasswordMutation } from "@/redux/features/user/userApi";
import { extractAuthError } from "@/redux/api/apiUtils";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Lock, ArrowLeft, CheckCircle, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Lozinka mora imati najmanje 6 karaktera"),
    password_confirmation: z.string().min(6, "Potvrdite lozinku"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Lozinke se ne podudaraju",
    path: ["password_confirmation"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token || !email) {
      toast.error("Failed", { description: "Invalid password reset link" });
      return;
    }

    try {
      const result = await resetPassword({
        token,
        email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      }).unwrap();
      toast.success(result.message || "Password reset successful!");
      setIsSubmitted(true);
    } catch (error: unknown) {
      const errorMessage = extractAuthError(error);
      toast.error("Password Reset Failed", { description: errorMessage });
    }
  };

  // Invalid or missing token/email
  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className={cn("flex flex-col gap-6 w-full max-w-md")}>
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Nevažeći link</CardTitle>
              <CardDescription>
                Link za resetovanje lozinke je nevažeći ili je istekao
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-gray-500">Zatražite novi link za resetovanje lozinke.</p>
              <div className="pt-4 space-y-2">
                <Link to="/forgot-password">
                  <Button className="w-full">Zatraži novi link</Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Nazad na prijavu
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className={cn("flex flex-col gap-6 w-full max-w-md")}>
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Lozinka promenjena!</CardTitle>
              <CardDescription>Vaša lozinka je uspešno resetovana</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-gray-500">Sada se možete prijaviti sa novom lozinkom.</p>
              <div className="pt-4">
                <Button className="w-full" onClick={() => navigate("/login")}>
                  Prijavi se
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className={cn("flex flex-col gap-6 w-full max-w-md")}>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Nova lozinka</CardTitle>
            <CardDescription>Unesite novu lozinku za vaš nalog</CardDescription>
          </CardHeader>
          <CardContent>
            <Form onSubmit={form.handleSubmit(onSubmit)} role="form">
              <div className="space-y-4">
                {/* Nova lozinka */}
                <FormField>
                  <FormLabel htmlFor="password">Nova lozinka</FormLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Unesite novu lozinku"
                      autoComplete="new-password"
                      {...form.register("password")}
                      disabled={isLoading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <FormMessage>{form.formState.errors.password.message}</FormMessage>
                  )}
                </FormField>

                {/* Potvrda lozinke */}
                <FormField>
                  <FormLabel htmlFor="password_confirmation">Potvrdite lozinku</FormLabel>
                  <div className="relative">
                    <Input
                      id="password_confirmation"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Ponovite novu lozinku"
                      autoComplete="new-password"
                      {...form.register("password_confirmation")}
                      disabled={isLoading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.password_confirmation && (
                    <FormMessage>{form.formState.errors.password_confirmation.message}</FormMessage>
                  )}
                </FormField>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Resetovanje u toku..." : "Resetuj lozinku"}
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm text-muted-foreground hover:text-primary inline-flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Nazad na prijavu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
