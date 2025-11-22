import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ManagedUser, useResetUserPasswordMutation } from "@/redux/features/userManagement/userManagementApi";
import { resetPasswordSchema, ResetPasswordFormData } from "@/utils/validation";

interface ResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ManagedUser | null;
}

export function ResetPasswordModal({ open, onOpenChange, user }: ResetPasswordModalProps) {
  const [resetPassword, { isLoading }] = useResetUserPasswordMutation();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!user) return;

    try {
      await resetPassword({ id: user.id, data }).unwrap();
      toast.success("Lozinka uspješno resetovana");
      onOpenChange(false);
      form.reset();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Greška pri resetovanju lozinke");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset lozinke</DialogTitle>
          <DialogDescription>
            Postavite novu lozinku za korisnika: {user?.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nova lozinka</Label>
            <Input
              id="password"
              type="password"
              {...form.register("password")}
              placeholder="Minimalno 8 karaktera"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Potvrda lozinke</Label>
            <Input
              id="password_confirmation"
              type="password"
              {...form.register("password_confirmation")}
              placeholder="Ponovite lozinku"
            />
            {form.formState.errors.password_confirmation && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password_confirmation.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Odustani
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset lozinke
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
