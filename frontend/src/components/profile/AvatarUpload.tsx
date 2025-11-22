import { useState, useRef } from "react";
import { useUploadAvatarMutation, useDeleteAvatarMutation } from "@/redux/features/user/userApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Camera, User, Loader2, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FullScreenLoader } from "@/components/ui/full-screen-loader";

interface AvatarUploadProps {
  currentAvatar?: string;
  userName?: string;
  className?: string;
  onUploadSuccess?: (avatarUrl: string) => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  userName,
  className,
  onUploadSuccess,
}) => {
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();
  const [deleteAvatar, { isLoading: isDeleting }] = useDeleteAvatarMutation();
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLoading = isUploading || isDeleting;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await uploadAvatar(selectedFile).unwrap();

      toast.success(result.message || "Avatar updated successfully!");
      setSelectedFile(null);
      setPreview(null);

      if (onUploadSuccess && result.user.avatar_url) {
        onUploadSuccess(result.user.avatar_url);
      }
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string; errors?: Record<string, string[]> } };
      // Handle Laravel validation errors format
      if (apiError?.data?.errors) {
        const firstField = Object.keys(apiError.data.errors)[0];
        const errorMessage = apiError.data.errors[firstField]?.[0] || "Validation failed";
        toast.error("Failed", { description: errorMessage });
      } else {
        const message = apiError?.data?.message || "Failed to upload avatar";
        toast.error("Failed", { description: message });
      }
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      const result = await deleteAvatar().unwrap();
      toast.success(result.message || "Avatar uklonjen uspješno!");
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string; errors?: Record<string, string[]> } };
      if (apiError?.data?.errors) {
        const firstField = Object.keys(apiError.data.errors)[0];
        const errorMessage = apiError.data.errors[firstField]?.[0] || "Validation failed";
        toast.error("Failed", { description: errorMessage });
      } else {
        const message = apiError?.data?.message || "Greška pri brisanju avatara";
        toast.error("Failed", { description: message });
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const displayImage = preview || currentAvatar;
  const initials = userName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <FullScreenLoader
        isLoading={isLoading}
        message={isUploading ? "Čuvam avatar..." : "Brišem avatar..."}
      />
      <div className={cn("flex flex-col items-center gap-4", className)}>
        {/* Avatar Display */}
        <div className="relative group">
          <div
            className={cn(
              "w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg",
              "bg-gradient-to-br from-blue-500 to-indigo-600",
              "flex items-center justify-center"
            )}
          >
            {displayImage ? (
              <img src={displayImage} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-3xl font-bold">
                {initials || <User className="h-12 w-12" />}
              </span>
            )}
          </div>

          {/* Camera overlay button */}
          <button
            type="button"
            onClick={triggerFileInput}
            disabled={isLoading}
            className={cn(
              "absolute bottom-0 right-0 p-2 rounded-full",
              "bg-white shadow-md border border-gray-200",
              "hover:bg-gray-50 transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
            ) : (
              <Camera className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Preview actions */}
        {selectedFile ? (
          <div className="flex gap-2">
            <Button onClick={handleUpload} disabled={isLoading} size="sm">
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Upload...
                </>
              ) : (
                "Sačuvaj avatar"
              )}
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={isLoading} size="sm">
              <X className="h-4 w-4 mr-1" />
              Otkaži
            </Button>
          </div>
        ) : (
          currentAvatar && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteAvatar}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Ukloni avatar
            </Button>
          )
        )}

        {/* Help text */}
        <p className="text-xs text-gray-500 text-center">
          Kliknite na ikonu kamere za promenu avatara
          <br />
          <span className="text-gray-400">JPG, PNG ili GIF (max 5MB)</span>
        </p>
      </div>
    </>
  );
};

export default AvatarUpload;
