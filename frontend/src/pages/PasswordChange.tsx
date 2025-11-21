import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordChangeSchema, PasswordChangeFormData } from "@/utils/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";

const PasswordChange = () => {
  const [success, setSuccess] = useState(false);
  const form = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: PasswordChangeFormData) => {
    // TODO: Dispatch Redux action to change password
    console.log("Updated:", data);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="flex flex-1 min-h-screen w-full overflow-hidden">
      <SidebarProvider>
        <SidebarInset>
          <main className="flex-1 flex flex-col min-h-0 w-full h-full overflow-y-auto">
            <div className="flex flex-1 flex-col w-full h-full justify-center items-center">
              <div className="max-w-md w-full space-y-6 mt-10">
                <h2 className="text-2xl font-bold mb-6">Change Password</h2>
                <Form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField>
                    <FormLabel htmlFor="currentPassword">Current Password</FormLabel>
                    <Input
                      id="currentPassword"
                      type="password"
                      {...form.register("currentPassword")}
                    />
                    {form.formState.errors.currentPassword && (
                      <FormMessage>{form.formState.errors.currentPassword.message}</FormMessage>
                    )}
                  </FormField>
                  <FormField>
                    <FormLabel htmlFor="newPassword">New Password</FormLabel>
                    <Input id="newPassword" type="password" {...form.register("newPassword")} />
                    {form.formState.errors.newPassword && (
                      <FormMessage>{form.formState.errors.newPassword.message}</FormMessage>
                    )}
                  </FormField>
                  <FormField>
                    <FormLabel htmlFor="confirmPassword">Confirm New Password</FormLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...form.register("confirmPassword")}
                    />
                    {form.formState.errors.confirmPassword && (
                      <FormMessage>{form.formState.errors.confirmPassword.message}</FormMessage>
                    )}
                  </FormField>
                  {success && (
                    <div className="mt-2 text-green-600">Password changed successfully!</div>
                  )}
                  <Button type="submit" className="mt-4">
                    Change Password
                  </Button>
                </Form>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default PasswordChange;
