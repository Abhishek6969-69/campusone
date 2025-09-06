"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function NoteUploadForm({ onClose, onSuccess }: Props) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) return;
    setIsSubmitting(true);

    try {
      // First, get a signed URL for uploading
      const urlRes = await fetch("/api/notes/upload-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: formData.file.name,
          fileType: formData.file.type,
        }),
      });

      if (!urlRes.ok) throw new Error("Failed to get upload URL");
      const { uploadUrl, fileUrl } = await urlRes.json();

      // Upload the file
      await fetch(uploadUrl, {
        method: "PUT",
        body: formData.file,
        headers: {
          "Content-Type": formData.file.type,
        },
      });

      // Create the note record
      const noteRes = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          fileUrl: fileUrl,
        }),
      });

      if (!noteRes.ok) throw new Error("Failed to create note");

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error uploading note:", error);
      // TODO: Show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div>
        <label
          htmlFor="file"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          File
        </label>
        <input
          type="file"
          id="file"
          name="file"
          required
          className="mt-1 block w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-blue-400"
          onChange={(e) =>
            setFormData({
              ...formData,
              file: e.target.files && e.target.files.length > 0 ? e.target.files[0] : null,
            })
          }
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !formData.file}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? "Uploading..." : "Upload Note"}
        </button>
      </div>
    </form>
  );
}
