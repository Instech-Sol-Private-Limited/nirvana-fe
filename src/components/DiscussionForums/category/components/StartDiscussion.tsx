"use client";

import React, { useRef, useState } from "react";
import PrimaryButton from "@/components/addons/buttons/PrimaryButton";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IoClose } from "react-icons/io5";
import { ImageIcon } from "lucide-react";
import SecondaryButton from "@/components/addons/buttons/SecondaryButton";
import { popupContent } from "../data";

const StartDiscussion = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setUploading(true);
      const reader = new FileReader();
      reader.onload = () => {
        setUploading(false);
        setUploadedFile(file.name);
      };
      reader.onerror = () => {
        setUploading(false);
        alert("Failed to upload file.");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <PrimaryButton
          text="Start New Discussion"
          className="!px-11 lg:!py-3 lg:!text-sm !text-xs shadow-button !rounded-2xl"
        />
      </DialogTrigger>

      <DialogContent className="w-[547px] p-6">
        <DialogTitle className="text-lg font-semibold leading-none tracking-tight">
          Create New Discussion
        </DialogTitle>

        <form className="flex flex-col gap-6 w-full">
          {popupContent.map((item) => (
            <div key={item.id} className="w-full flex flex-col gap-3">
              <label htmlFor={item.name} className="text-textdark font-normal">
                {item.label}
              </label>
              {item.type === "textarea" ? (
                <textarea
                  id={item.name}
                  name={item.name}
                  rows={5}
                  className="md:py-4 p-2.5 px-5 rounded-2xl bg-[#F2F2F2] border border-[#E4E4E4] focus:outline-none"
                  placeholder={item.placeholder}
                ></textarea>
              ) : (
                <input
                  id={item.name}
                  type={item.type}
                  name={item.name}
                  className="md:py-4 p-2.5 px-5 rounded-2xl bg-[#F2F2F2] border border-[#E4E4E4] focus:outline-none"
                  placeholder={item.placeholder}
                />
              )}
            </div>
          ))}

          <div className="w-full flex items-center justify-between gap-5">
            {uploadedFile ? (
              <div className="flex items-center gap-3 opacity-60 text-primary">
                <span className="text-sm">{uploadedFile}</span>
                <IoClose
                  className="text-base cursor-pointer"
                  onClick={removeUploadedFile}
                />
              </div>
            ) : (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleUpload}
                />
                <PrimaryButton
                  text={uploading ? "Uploading..." : "Upload Image"}
                  className="!bg-gradient-to-r from-[#FA3F43] to-[#8D1B3D] !text-sm !font-medium !gap-2 !py-2 !px-3 !rounded-xl"
                  icon={
                    uploading ? (
                      <span className="border-t-2 border-r-2 border-white animate-spin w-4 h-4 rounded-full" />
                    ) : (
                      <ImageIcon />
                    )
                  }
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                />
              </>
            )}

            <div className="flex items-center gap-4">
              <DialogTrigger>
                <SecondaryButton
                  text="Cancel"
                  className="!text-sm !font-medium !gap-2 !py-2 !px-3 !rounded-xl !border-none !text-textdark"
                />
              </DialogTrigger>
              
              <PrimaryButton
                text="Post Comment"
                className="!text-sm !font-medium !gap-2 !py-2 !px-3 !rounded-xl"
              />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StartDiscussion;
