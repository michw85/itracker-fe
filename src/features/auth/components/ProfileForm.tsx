import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectUser, updateProfile } from "../slice/authSlice";

const ProfileForm = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [isEditing, setIsEditing] = useState(false);
  //const [successMessage, setSuccessMessage] = useState<string | undefined>();

  const formik = useFormik({
   
    enableReinitialize: true,
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
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      bio: Yup.string().max(1000, "Bio must be at max 1000 characters"),
      position: Yup.string(),
      department: Yup.string(),
      avatarUrl: Yup.string().url("Must be a valid URL").nullable(),
    }),
    onSubmit: async (values, { resetForm }) => {
      const result = await dispatch(updateProfile(values));
      if (updateProfile.fulfilled.match(result)) {
        resetForm(); 
      }
    },
  });

  const isSaveDisabled =
    !formik.dirty ||
    Object.keys(formik.errors).length > 0 ||
    formik.isSubmitting;

  return (
    <div className="mx-auto max-w-sm space-y-6 p-6 rounded-lg border bg-white shadow-sm mt-10">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Profile</h1>

        <p className="text-sm text-gray-500">
          {isEditing
            ? "Edit your profile information"
            : "Your profile information"}
        </p>

        {/* successMessage && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200"> 
            {successMessage}
          </div>
        )*/}

        {user?.role && (
          <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
            {user.role}
          </span>
        )}
      </div>

      {/* Avatar */}
      {user?.avatarUrl && (
        <div className="flex justify-center">
          <img
            src={user.avatarUrl}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Display Name */}
        <input
          type="text"
          placeholder="Display Name"
          {...formik.getFieldProps("displayName")}
          disabled={!isEditing}
          className={`w-full px-3 py-2 border rounded-md ${
            formik.touched.displayName && formik.errors.displayName
              ? "border-red-500"
              : "border-gray-300"
          }`}
        />
        {formik.touched.displayName && formik.errors.displayName && (
          <p className="text-sm text-red-500">{formik.errors.displayName}</p>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          {...formik.getFieldProps("email")}
          disabled={!isEditing}
          className={`w-full px-3 py-2 border rounded-md ${
            formik.touched.email && formik.errors.email
              ? "border-red-500"
              : "border-gray-300"
          }`}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-sm text-red-500">{formik.errors.email}</p>
        )}

        {/* Position */}
        <input
          type="text"
          placeholder="Position"
          {...formik.getFieldProps("position")}
          disabled={!isEditing}
          className="w-full px-3 py-2 border rounded-md border-gray-300"
        />

        {/* Department */}
        <input
          type="text"
          placeholder="Department"
          {...formik.getFieldProps("department")}
          disabled={!isEditing}
          className="w-full px-3 py-2 border rounded-md border-gray-300"
        />

        {/* Bio */}
        <textarea
          placeholder="Bio"
          rows={3}
          {...formik.getFieldProps("bio")}
          disabled={!isEditing}
          className={`w-full px-3 py-2 border rounded-md ${
            formik.touched.bio && formik.errors.bio
              ? "border-red-500"
              : "border-gray-300"
          }`}
        />
        {formik.touched.bio && formik.errors.bio && (
          <p className="text-sm text-red-500">{formik.errors.bio}</p>
        )}

        {/* Avatar URL (только в режиме редактирования) */}
        {isEditing && (
          <input
            type="text"
            placeholder="Avatar URL"
            {...formik.getFieldProps("avatarUrl")}
            className={`w-full px-3 py-2 border rounded-md ${
              formik.touched.avatarUrl && formik.errors.avatarUrl
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-zinc-800"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="submit"
                disabled={isSaveDisabled}
                className={`flex-1 py-2 rounded-md text-white transition
                  ${
                    isSaveDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black hover:bg-zinc-800"
                  }`}
              >
                Save
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  formik.resetForm();
                }}
                className="flex-1 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
