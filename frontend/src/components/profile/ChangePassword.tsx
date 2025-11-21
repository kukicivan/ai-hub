import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordChangeSchema, PasswordChangeFormData } from "@/utils/validation";
import { useChangePasswordMutation } from "@/redux/features/user/userApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface ChangePasswordProps {
  className?: string;
}

export const ChangePassword: React.FC<ChangePasswordProps> = ({ className }) => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordChangeFormData) => {
    try {
      const result = await changePassword({
        current_password: data.currentPassword,
        password: data.newPassword,
        password_confirmation: data.confirmPassword,
      }).unwrap();

      toast.success(result.message || "Password changed successfully!");
      form.reset();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string; errors?: Record<string, string[]> } };
      // Handle Laravel validation errors format
      if (apiError?.data?.errors) {
        const firstField = Object.keys(apiError.data.errors)[0];
        const errorMessage = apiError.data.errors[firstField]?.[0] || "Validation failed";
        toast.error("Failed", { description: errorMessage });
      } else {
        const message = apiError?.data?.message || "Failed to change password";
        toast.error("Failed", { description: message });
      }
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Promena lozinke
        </CardTitle>
        <CardDescription>Promenite vašu lozinku za pristup nalogu</CardDescription>
      </CardHeader>
      <CardContent>
        <Form onSubmit={form.handleSubmit(onSubmit)} role="form">
          <div className="space-y-4">
            {/* Trenutna lozinka */}
            <FormField>
              <FormLabel htmlFor="currentPassword">Trenutna lozinka *</FormLabel>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Unesite trenutnu lozinku"
                  autoComplete="current-password"
                  {...form.register("currentPassword")}
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {form.formState.errors.currentPassword && (
                <FormMessage>{form.formState.errors.currentPassword.message}</FormMessage>
              )}
            </FormField>

            {/* Nova lozinka */}
            <FormField>
              <FormLabel htmlFor="newPassword">Nova lozinka *</FormLabel>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Unesite novu lozinku"
                  autoComplete="new-password"
                  {...form.register("newPassword")}
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.newPassword && (
                <FormMessage>{form.formState.errors.newPassword.message}</FormMessage>
              )}
            </FormField>

            {/* Potvrda nove lozinke */}
            <FormField>
              <FormLabel htmlFor="confirmPassword">Potvrdite novu lozinku *</FormLabel>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ponovite novu lozinku"
                  autoComplete="new-password"
                  {...form.register("confirmPassword")}
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
              {form.formState.errors.confirmPassword && (
                <FormMessage>{form.formState.errors.confirmPassword.message}</FormMessage>
              )}
            </FormField>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Menjam lozinku..." : "Promeni lozinku"}
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;
