import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormData } from "@/utils/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar } from "@/components/ui/avatar";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useState } from "react";

const ProfilePage = () => {
  const user = useAppSelector(selectCurrentUser);
  const [editMode, setEditMode] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      bio: "",
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    // TODO: Dispatch Redux action to update profile
    console.log("Profile updated:", data);
    setEditMode(false);
  };

  return (
    <div className="flex flex-1 min-h-screen w-full overflow-hidden">
      <SidebarProvider>
        <SidebarInset>
          <main className="flex-1 flex flex-col min-h-0 w-full h-full overflow-y-auto">
            <div className="flex flex-1 flex-col w-full h-full justify-center items-center">
              <div className="max-w-xl w-full space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <span className="text-xl font-semibold">
                      {user?.name?.[0] || user?.email?.[0] || "U"}
                    </span>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
                  </div>
                </div>
                {editMode ? (
                  <Form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField>
                      <FormLabel htmlFor="name">Name</FormLabel>
                      <Input id="name" {...form.register("name")} />
                      {form.formState.errors.name && (
                        <FormMessage>{form.formState.errors.name.message}</FormMessage>
                      )}
                    </FormField>
                    <FormField>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Input id="email" type="email" {...form.register("email")} />
                      {form.formState.errors.email && (
                        <FormMessage>{form.formState.errors.email.message}</FormMessage>
                      )}
                    </FormField>
                    <FormField>
                      <FormLabel htmlFor="phone">Phone</FormLabel>
                      <Input id="phone" {...form.register("phone")} />
                      {form.formState.errors.phone && (
                        <FormMessage>{form.formState.errors.phone.message}</FormMessage>
                      )}
                    </FormField>
                    <FormField>
                      <FormLabel htmlFor="bio">Bio</FormLabel>
                      <Input id="bio" {...form.register("bio")} />
                      {form.formState.errors.bio && (
                        <FormMessage>{form.formState.errors.bio.message}</FormMessage>
                      )}
                    </FormField>
                    <div className="flex gap-2 mt-4">
                      <Button type="submit">Save</Button>
                      <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                        Cancel
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold">Name:</span> {user?.name}
                    </div>
                    <div>
                      <span className="font-semibold">Email:</span> {user?.email}
                    </div>
                    <div>
                      <span className="font-semibold">Phone:</span> -
                    </div>
                    <div>
                      <span className="font-semibold">Bio:</span> -
                    </div>
                    <Button className="mt-4" onClick={() => setEditMode(true)}>
                      Edit Profile
                    </Button>
                  </div>
                )}
                <div className="mt-6">
                  <span className="block font-semibold mb-2">Avatar (UI only)</span>
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-3xl">{user?.name?.[0] || user?.email?.[0] || "U"}</span>
                  </div>
                  <Button className="mt-2" variant="outline" disabled>
                    Upload Avatar (Coming Soon)
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default ProfilePage;
