import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectUser,
  updateProfile,
  updateAvatarUrl,
  // uploadAvatarFile,
} from "../slice/authSlice";

const ProfileForm = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const formik = useFormik({
    enableReinitialize: !isEditing,
    initialValues: {
      displayName: user?.displayName || "",
      email: user?.email || "",
      bio: user?.bio || "",
      position: user?.position || "",
      department: user?.department || "",
      avatarUrl: user?.avatarUrl || "",
    },
    validationSchema: Yup.object({
      displayName: Yup.string().required("Display name is required"),
      email: Yup.string().email("Invalid email address"),
      //    .required("Email is required"),
      bio: Yup.string().max(1000, "Bio must be at max 1000 characters"),
      position: Yup.string(),
      department: Yup.string(),
      avatarUrl: Yup.string().nullable(),
    }),
    onSubmit: async (values) => {
      const { avatarUrl, ...profileData } = values;

      const result = await dispatch(updateProfile(profileData));
      console.log("avatarUrl:", avatarUrl);
      console.log("selectedFile:", selectedFile);
      if (avatarUrl) {
        if (selectedFile) {
          await dispatch(
            updateAvatarUrl(
              "https://pngimg.com/uploads/under_construction/under_construction_PNG68.png",
            ),
          );
          // await dispatch(uploadAvatarFile(selectedFile));   // Fertige 3S
        } else {
          // URL
          await dispatch(updateAvatarUrl(avatarUrl));
        }
      }

      if (updateProfile.fulfilled.match(result)) {
        setIsEditing(false);
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(undefined), 3000);
      }
    },
  });

  return (
    <div className="mx-auto max-w-sm space-y-6 p-6 rounded-lg border bg-white shadow-sm mt-10">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground text-gray-500">
          {isEditing
            ? "Edit your profile information"
            : "Your profile information"}
        </p>
        {successMessage && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
            {successMessage}
          </div>
        )}

        {/* Role & Confirmation Status */}
        <div className="flex justify-center gap-2 flex-wrap pt-1">
          {user?.role && (
            <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {user.role}
            </span>
          )}
        </div>
      </div>

      {/* Avatar */}
      {user?.avatarUrl && (
        <div className="flex justify-center">
          <img
            src={user.avatarUrl}
            alt="Avatar"
            className="w-30 h-30 rounded-full object-cover border"
          />
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Avatar URL */}
        {isEditing && (
          <div className="space-y-2">
            <label
              htmlFor="avatarUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Avatar URL
            </label>
            <div className="flex gap-2">
              <input
                id="avatarUrl"
                type="text"
                {...formik.getFieldProps("avatarUrl")}
                onChange={(e) => {
                  formik.setFieldValue("avatarUrl", e.target.value);
                  setSelectedFile(null);
                }}
                className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring ${
                  formik.touched.avatarUrl && formik.errors.avatarUrl
                    ? "border-red-500 focus:ring-red-500"
                    : "border-input"
                }`}
                placeholder="https://example.com/avatar.jpg"
              />
              <label className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 whitespace-nowrap">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      formik.setFieldValue("avatarUrl", file.name);
                      console.log("File selected:", file.name);
                    }
                  }}
                />
              </label>
            </div>
            {formik.touched.avatarUrl && formik.errors.avatarUrl && (
              <p className="text-sm text-red-500">{formik.errors.avatarUrl}</p>
            )}
          </div>
        )}

        {/* Display Name */}
        <div className="space-y-2">
          <label
            htmlFor="displayName"
            className="block text-sm font-medium text-gray-700"
          >
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            {...formik.getFieldProps("displayName")}
            disabled={!isEditing}
            className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring disabled:bg-gray-50 disabled:text-gray-500 ${
              formik.touched.displayName && formik.errors.displayName
                ? "border-red-500 focus:ring-red-500"
                : "border-input"
            }`}
            placeholder="Your name"
          />
          {formik.touched.displayName && formik.errors.displayName && (
            <p className="text-sm text-red-500">{formik.errors.displayName}</p>
          )}
        </div>

        {/* Email — always disabled, BE does not update it */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...formik.getFieldProps("email")}
            disabled // ={!isEditing}
            className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring disabled:bg-gray-50 disabled:text-gray-500 ${
              formik.touched.email && formik.errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-input"
            }`}
            placeholder="you@example.com"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-sm text-red-500">{formik.errors.email}</p>
          )}
        </div>

        {/* Position */}
        <div className="space-y-2">
          <label
            htmlFor="position"
            className="block text-sm font-medium text-gray-700"
          >
            Position
          </label>
          <input
            id="position"
            type="text"
            {...formik.getFieldProps("position")}
            disabled={!isEditing}
            className="w-full px-3 py-2 text-sm border rounded-md shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring disabled:bg-gray-50 disabled:text-gray-500 border-input"
            placeholder="e.g. Frontend Developer"
          />
        </div>

        {/* Department */}
        <div className="space-y-2">
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700"
          >
            Department
          </label>
          <input
            id="department"
            type="text"
            {...formik.getFieldProps("department")}
            disabled={!isEditing}
            className="w-full px-3 py-2 text-sm border rounded-md shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring disabled:bg-gray-50 disabled:text-gray-500 border-input"
            placeholder="e.g. Engineering"
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700"
          >
            Bio
          </label>
          <textarea
            id="bio"
            {...formik.getFieldProps("bio")}
            disabled={!isEditing}
            rows={3}
            className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring disabled:bg-gray-50 disabled:text-gray-500 ${
              formik.touched.bio && formik.errors.bio
                ? "border-red-500 focus:ring-red-500"
                : "border-input"
            }`}
            placeholder="Short bio..."
          />
          {formik.touched.bio && formik.errors.bio && (
            <p className="text-sm text-red-500">{formik.errors.bio}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          {isEditing && (
            <>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="flex-1 inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
              >
                {formik.isSubmitting ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  formik.resetForm();
                }}
                className="flex-1 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </form>

      {/* Edit Profile */}
      {!isEditing && (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="w-full inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default ProfileForm;