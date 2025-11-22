import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  ManagedUser,
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetUserTypesQuery,
} from "@/redux/features/userManagement/userManagementApi";
import {
  createUserSchema,
  updateUserSchema,
  CreateUserFormData,
  UpdateUserFormData,
} from "@/utils/validation";
import { toast } from "sonner";

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: ManagedUser | null;
  onSuccess?: () => void;
}

export function UserModal({ open, onOpenChange, user, onSuccess }: UserModalProps) {
  const isEditing = !!user;

  const { data: userTypesData, isLoading: isLoadingUserTypes } = useGetUserTypesQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const isLoading = isCreating || isUpdating;

  // Use different schemas for create vs edit
  const schema = isEditing ? updateUserSchema : createUserSchema;

  const form = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      user_type_id: 0,
      phone: "",
      bio: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    },
  });

  // Reset form when user changes or modal opens
  useEffect(() => {
    if (open) {
      if (user) {
        form.reset({
          name: user.name || "",
          email: user.email || "",
          user_type_id: user.user_type_id || 0,
          phone: user.phone || "",
          bio: user.bio || "",
          address_line_1: user.address_line_1 || "",
          address_line_2: user.address_line_2 || "",
          city: user.city || "",
          state: user.state || "",
          postal_code: user.postal_code || "",
          country: user.country || "",
        });
      } else {
        form.reset({
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
          user_type_id: 0,
          phone: "",
          bio: "",
          address_line_1: "",
          address_line_2: "",
          city: "",
          state: "",
          postal_code: "",
          country: "",
        });
      }
    }
  }, [open, user, form]);

  const onSubmit = async (data: CreateUserFormData | UpdateUserFormData) => {
    try {
      if (isEditing && user) {
        await updateUser({ id: user.id, data: data as UpdateUserFormData }).unwrap();
        toast.success("Korisnik uspješno ažuriran");
      } else {
        await createUser(data as CreateUserFormData).unwrap();
        toast.success("Korisnik uspješno kreiran");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string; errors?: Record<string, string[]> } };
      if (err.data?.errors) {
        Object.entries(err.data.errors).forEach(([field, messages]) => {
          form.setError(field as keyof (CreateUserFormData | UpdateUserFormData), {
            message: messages[0],
          });
        });
      } else {
        toast.error(err.data?.message || "Greška pri spremanju korisnika");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Uredi korisnika" : "Novi korisnik"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Ažurirajte informacije o korisniku"
              : "Unesite informacije za novog korisnika"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <ScrollArea className="max-h-[60vh] pr-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="basic">Osnovni podaci</TabsTrigger>
                <TabsTrigger value="address">Adresa</TabsTrigger>
                <TabsTrigger value="additional">Dodatno</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ime i prezime *</Label>
                    <Input
                      id="name"
                      {...form.register("name")}
                      placeholder="Unesite ime i prezime"
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      placeholder="korisnik@primjer.com"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {!isEditing && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Lozinka *</Label>
                      <Input
                        id="password"
                        type="password"
                        {...form.register("password")}
                        placeholder="Minimalno 8 karaktera"
                      />
                      {"password" in form.formState.errors && form.formState.errors.password && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password_confirmation">Potvrda lozinke *</Label>
                      <Input
                        id="password_confirmation"
                        type="password"
                        {...form.register("password_confirmation")}
                        placeholder="Ponovite lozinku"
                      />
                      {"password_confirmation" in form.formState.errors &&
                        form.formState.errors.password_confirmation && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.password_confirmation.message}
                          </p>
                        )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user_type_id">Tip korisnika *</Label>
                    <Select
                      value={form.watch("user_type_id")?.toString() || ""}
                      onValueChange={(value) => form.setValue("user_type_id", parseInt(value))}
                      disabled={isLoadingUserTypes}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Odaberite tip korisnika" />
                      </SelectTrigger>
                      <SelectContent>
                        {userTypesData?.userTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.user_type_id && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.user_type_id.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input id="phone" {...form.register("phone")} placeholder="+387 61 123 456" />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="address" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address_line_1">Ulica i broj</Label>
                  <Input
                    id="address_line_1"
                    {...form.register("address_line_1")}
                    placeholder="Maršala Tita 10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address_line_2">Dodatne informacije</Label>
                  <Input
                    id="address_line_2"
                    {...form.register("address_line_2")}
                    placeholder="Stan, kat, ulaz (opcionalno)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Grad</Label>
                    <Input id="city" {...form.register("city")} placeholder="Sarajevo" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Poštanski broj</Label>
                    <Input id="postal_code" {...form.register("postal_code")} placeholder="71000" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">Regija/Kanton</Label>
                    <Input id="state" {...form.register("state")} placeholder="Kanton Sarajevo" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Država</Label>
                    <Input
                      id="country"
                      {...form.register("country")}
                      placeholder="Bosna i Hercegovina"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="additional" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografija</Label>
                  <Textarea
                    id="bio"
                    {...form.register("bio")}
                    placeholder="Kratki opis korisnika..."
                    rows={5}
                  />
                  {form.formState.errors.bio && (
                    <p className="text-sm text-destructive">{form.formState.errors.bio.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Maksimalno 1000 karaktera</p>
                </div>

                {isEditing && user && (
                  <div className="rounded-lg border p-4 bg-muted/50">
                    <h4 className="font-medium mb-2">Informacije o računu</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">ID:</span>{" "}
                        <span className="font-mono">{user.id}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email verificiran:</span>{" "}
                        <span>{user.email_verified_at ? "Da" : "Ne"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Kreiran:</span>{" "}
                        <span>{new Date(user.created_at).toLocaleDateString("bs-BA")}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ažuriran:</span>{" "}
                        <span>{new Date(user.updated_at).toLocaleDateString("bs-BA")}</span>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </ScrollArea>

          <DialogFooter className="mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Odustani
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Spremi promjene" : "Kreiraj korisnika"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
