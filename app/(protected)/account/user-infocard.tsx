"use client";
import React, { useEffect, useState } from "react";
import { Pencil, Facebook, X, Linkedin, Instagram } from "lucide-react"
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/use-modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { user } from "@/lib/generated/prisma/client";
import { capitalizeFirstLetter } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";

// FilePond imports
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import { UserAvatar } from "@/components/common/user-avatar";

// Register plugins
registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginFileValidateType,
  FilePondPluginImageTransform
);

export default function UserInfoCard({ user }: { user: user | null }) {
  const { isOpen, openModal, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [userImage, setUserImage] = useState(user?.image || "");
  

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(/[,\s]+/)[0] || "",
    lastName: user?.name?.split(/[,\s]+/)[1] || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    role: user?.role || "",
    facebook: user?.facebook || "",
    twitter: user?.twitter || "",
    linkedin: user?.linkedin || "",
    instagram: user?.instagram || "",
  });

  useEffect(() => {
    if (user) {
      const nameParts = user.name?.split(/[,\s]+/) || [];
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        role: user.role || "",
        facebook: user.facebook || "",
        twitter: user.twitter || "",
        linkedin: user.linkedin || "",
        instagram: user.instagram || "",
      });
      setUserImage(user.image || "");
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Combine firstName and lastName into name
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      // Update user profile using better-auth
      const { data, error } = await authClient.updateUser({
        name: fullName,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        facebook: formData.facebook,
        twitter: formData.twitter,
        linkedin: formData.linkedin,
        instagram: formData.instagram,
      });

      if (error) {
        toast.error("Failed to update profile: " + error.message);
        return;
      }

      toast.success("Profile updated successfully!");
      closeModal();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An unexpected error occurred while updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

const handleImageUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select an image to upload");
      return;
    }

    setIsUploadingImage(true);
    try {
      // Get the processed file from FilePond (after crop/resize)
      const fileItem = files[0];
      
      // FilePond stores the processed file in the 'file' property after transformations
      const processedFile = fileItem.file;
      
      // If FilePond has processed the file, it will have the transformed data
      // Otherwise, we need to manually process it
      let finalFile = processedFile;
      
      // Check if FilePond has already processed the file with transformations
      if (fileItem.serverId || fileItem.origin === 2) {
        // File was processed by FilePond
        finalFile = processedFile;
      }
      
      // Convert the final file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(finalFile);
      });

      // Update user image via better-auth with base64 data
      const { error } = await authClient.updateUser({
        image: base64,
      });

      if (error) {
        toast.error("Failed to update profile image: " + error.message);
        return;
      }

      setUserImage(base64);
      toast.success("Profile image updated successfully!");
      setIsImageModalOpen(false);
      setFiles([]);

      // Refresh the session to update all components using the session
      await authClient.getSession({ 
        fetchOptions: {
          cache: 'no-cache'
        }
      });
      
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };


  return (
    <>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-bl *:data-[slot=card]:shadow-xs">
        <Card className="@container/card">
          <div className="pl-5 pr-5 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
              <div className="w-20 h-20 relative overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                 <UserAvatar user={{ name: user?.name, image: '' }} size={80}/>
                <a
                  href="#"
                  className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-2 text-[11px] font-medium tracking-wide text-white bg-black/45 backdrop-blur-sm dark:bg-white/15 hover:bg-black/55 dark:hover:bg-white/25 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsImageModalOpen(true);
                  }}
                >
                  Change
                </a>
              </div>
              <div className="order-3 xl:order-2">
                <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                  {capitalizeFirstLetter(formData.firstName)} {capitalizeFirstLetter(formData.lastName)}
                </h4>
                <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{capitalizeFirstLetter(formData.role ?? "Team Lead")}</p>
                  <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Arizona, United States</p>
                </div>
              </div>
              <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.facebook.com/"
                  className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                >
                  <Facebook className="size-5" />
                </a>

                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                >
                  <X className="size-5" />
                </a>

                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                >
                  <Linkedin className="size-5" />
                </a>

                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                >
                  <Instagram className="size-5" />
                </a>
              </div>
            </div>
            <button
              onClick={openModal}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
            >
              <Pencil className="size-4" />
              Edit
            </button>
          </div>
        </Card>
      </div>
      <Card className="@container/card">
        <div className="pl-5 pr-5 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">Personal Information</h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">First Name</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {capitalizeFirstLetter(formData.firstName)}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Last Name</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {capitalizeFirstLetter(formData.lastName)}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Email address</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{formData.email}</p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{formData.phoneNumber ?? ""}</p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Bio</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{formData.role ?? ""}</p>
              </div>
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <Pencil className="size-4" />
            Edit
          </button>
        </div>
      </Card>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Edit Personal Information</h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">Social Links</h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Facebook</Label>
                    <Input
                      type="text"
                      value={formData.facebook}
                      onChange={(e) => handleInputChange("facebook", e.target.value)}
                      placeholder="https://www.facebook.com/"
                    />
                  </div>

                  <div>
                    <Label>X.com</Label>
                    <Input
                      type="text"
                      value={formData.twitter}
                      onChange={(e) => handleInputChange("twitter", e.target.value)}
                      placeholder="https://x.com/"
                    />
                  </div>

                  <div>
                    <Label>Linkedin</Label>
                    <Input
                      type="text"
                      value={formData.linkedin}
                      onChange={(e) => handleInputChange("linkedin", e.target.value)}
                      placeholder="https://www.linkedin.com/"
                    />
                  </div>

                  <div>
                    <Label>Instagram</Label>
                    <Input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => handleInputChange("instagram", e.target.value)}
                      placeholder="https://instagram.com/"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>First Name</Label>
                    <Input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Last Name</Label>
                    <Input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      disabled // Usually email changes require verification
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Bio</Label>
                    <Input
                      type="text"
                      value={formData.role}
                      onChange={(e) => handleInputChange("role", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal} type="button" disabled={isLoading}>
                Close
              </Button>
              <Button size="sm" type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Image Upload Modal */}
      <Modal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} className="max-w-[500px] m-4">
        <div className="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
          <div className="mb-6">
            <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">Upload Profile Image</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose a new profile picture. Image will be cropped to a square.
            </p>
          </div>
          
          <div className="mb-6">
            <FilePond
              files={files}
              onupdatefiles={setFiles}
              allowMultiple={false}
              acceptedFileTypes={['image/jpeg', 'image/png', 'image/jpg', 'image/webp']}
              maxFiles={1}
              name="avatar"
              labelIdle='Drag & Drop your image or <span class="filepond--label-action">Browse</span>'
              
              // Image crop settings
              imageCropAspectRatio="1:1"
              allowImageCrop={true}
              imagePreviewHeight={170}
              imagePreviewTransparencyIndicator="#fff"
              
              // Image resize settings
              imageResizeTargetWidth={100}
              imageResizeTargetHeight={100}
              imageResizeMode="cover"
              
              allowImageTransform={true}
              imageTransformOutputMimeType="image/jpeg"
              imageTransformOutputQuality={90}
              
              // Layout and positioning
              stylePanelLayout="compact circle"
              styleLoadIndicatorPosition="center bottom"
              styleProgressIndicatorPosition="right bottom"
              styleButtonRemoveItemPosition="left bottom"
              styleButtonProcessItemPosition="right bottom"
              
              credits={false}
            />
          </div>

          <div className="flex items-center gap-3 justify-end">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                setIsImageModalOpen(false);
                setFiles([]);
              }} 
              disabled={isUploadingImage}
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleImageUpload} 
              disabled={isUploadingImage || files.length === 0}
            >
              {isUploadingImage ? "Uploading..." : "Upload Image"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
