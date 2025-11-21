import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormData } from "@/utils/validation";
import { useUpdateProfileMutation } from "@/redux/features/user/userApi";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { User, Settings, Lock } from "lucide-react";
import { useEffect } from "react";
import AvatarUpload from "@/components/profile/AvatarUpload";
import ChangePassword from "@/components/profile/ChangePassword";

const Profile = () => {
  const user = useAppSelector(selectCurrentUser);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      bio: "",
      address_line_1: "",
      address_line_2: "",
      address_line_3: "",
    },
  });

  // Populate form with user data
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        address_line_1: user.address_line_1 || "",
        address_line_2: user.address_line_2 || "",
        address_line_3: user.address_line_3 || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const result = await updateProfile({
        name: data.name,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        address_line_1: data.address_line_1,
        address_line_2: data.address_line_2,
        address_line_3: data.address_line_3,
      }).unwrap();

      toast.success(result.message || "Profile updated successfully!");
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string; errors?: Record<string, string[]> } };
      // Handle Laravel validation errors format
      if (apiError?.data?.errors) {
        const firstField = Object.keys(apiError.data.errors)[0];
        const errorMessage = apiError.data.errors[firstField]?.[0] || "Validation failed";
        toast.error("Failed", { description: errorMessage });
      } else {
        const message = apiError?.data?.message || "Failed to update profile";
        toast.error("Failed", { description: message });
      }
    }
  };

  return (
    <div className="h-full bg-gray-100 py-8 overflow-auto">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Podešavanja profila</h1>
          <p className="text-gray-600 mt-2">Upravljajte vašim nalogom i podešavanjima</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Bezbednost
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Avatar Section */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Avatar</CardTitle>
                  <CardDescription>Vaša profilna slika</CardDescription>
                </CardHeader>
                <CardContent>
                  <AvatarUpload currentAvatar={user?.avatar ?? undefined} userName={user?.name} />
                </CardContent>
              </Card>

              {/* Profile Form */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Osnovne informacije
                  </CardTitle>
                  <CardDescription>Ažurirajte vaše lične podatke</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form onSubmit={form.handleSubmit(onSubmit)} role="form">
                    <div className="space-y-4">
                      {/* Ime */}
                      <FormField>
                        <FormLabel htmlFor="name">Ime i prezime *</FormLabel>
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
                        <FormLabel htmlFor="email">Email adresa *</FormLabel>
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

                      {/* Bio */}
                      <FormField>
                        <FormLabel htmlFor="bio">Biografija</FormLabel>
                        <Textarea
                          id="bio"
                          placeholder="Kratko o vama..."
                          {...form.register("bio")}
                          disabled={isLoading}
                          rows={4}
                        />
                        {form.formState.errors.bio && (
                          <FormMessage>{form.formState.errors.bio.message}</FormMessage>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Maksimalno 200 karaktera</p>
                      </FormField>

                      <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Čuvam..." : "Sačuvaj promene"}
                        </Button>
                      </div>
                    </div>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Account Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Informacije o nalogu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">ID korisnika</p>
                    <p className="text-sm text-gray-900">{user?.id || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Uloga</p>
                    <p className="text-sm text-gray-900 capitalize">{user?.role || "Korisnik"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email verifikovan</p>
                    <p className="text-sm text-gray-900">{user?.email_verified_at ? "Da" : "Ne"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nalog kreiran</p>
                    <p className="text-sm text-gray-900">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString("sr-RS")
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ChangePassword />

              {/* Delete Account Card */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Zona opasnosti</CardTitle>
                  <CardDescription>Nepovratne akcije vezane za vaš nalog</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-medium text-red-800 mb-2">Brisanje naloga</h4>
                    <p className="text-sm text-red-600 mb-4">
                      Jednom kada obrišete nalog, nema povratka. Svi vaši podaci će biti trajno
                      izbrisani.
                    </p>
                    <Button variant="destructive" size="sm">
                      Obriši nalog
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
