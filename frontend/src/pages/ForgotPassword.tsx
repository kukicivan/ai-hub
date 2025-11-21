import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForgotPasswordMutation } from "@/redux/features/user/userApi";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.string().email("Unesite validnu email adresu"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const result = await forgotPassword({ email: data.email }).unwrap();
      toast.success(result.message || "Password reset link sent!");
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch (error: unknown) {
      const apiError = error as {
        data?: { message?: string; errors?: Record<string, string[]> };
        status?: number;
      };
      // Handle Laravel validation errors (show actual error)
      if (apiError?.data?.errors) {
        const firstField = Object.keys(apiError.data.errors)[0];
        const errorMessage = apiError.data.errors[firstField]?.[0] || "Validation failed";
        toast.error("Failed", { description: errorMessage });
      } else if (apiError?.status === 422) {
        // Validation error without errors object
        const message = apiError?.data?.message || "Invalid email address";
        toast.error("Failed", { description: message });
      } else {
        // For security reasons, show success screen even on other errors
        // (don't reveal if email exists in system)
        setSubmittedEmail(data.email);
        setIsSubmitted(true);
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className={cn("flex flex-col gap-6 w-full max-w-md")}>
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Proverite email</CardTitle>
              <CardDescription>Poslali smo link za resetovanje lozinke na</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="font-medium text-gray-900">{submittedEmail}</p>
              <p className="text-sm text-gray-500">
                Ako ne vidite email, proverite spam folder. Link ističe za 60 minuta.
              </p>
              <div className="pt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsSubmitted(false);
                    form.reset();
                  }}
                >
                  Pošalji ponovo
                </Button>
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className={cn("flex flex-col gap-6 w-full max-w-md")}>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Zaboravili ste lozinku?</CardTitle>
            <CardDescription>
              Unesite vašu email adresu i poslaćemo vam link za resetovanje lozinke
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form onSubmit={form.handleSubmit(onSubmit)} role="form">
              <div className="space-y-4">
                <FormField>
                  <FormLabel htmlFor="email">Email adresa</FormLabel>
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

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Slanje u toku..." : "Pošalji link za reset"}
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

export default ForgotPassword;
