import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  acceptInvite,
  selectAcceptInviteMessage,
  clearInviteMessages,
} from "../features/projects/slice/projectsSlice";

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const message = useAppSelector(selectAcceptInviteMessage);
  const [isProcessing, setIsProcessing] = useState(true);

  const inviteToken = searchParams.get("inviteToken");

  useEffect(() => {
    // Redirect if no token
    if (!inviteToken) {
      navigate("/");
      return;
    }

    // Process invitation
    const processInvite = async () => {
      try {
        await dispatch(acceptInvite(inviteToken)).unwrap();
      } catch {
        // Error is already handled in slice
      } finally {
        setIsProcessing(false);
      }
    };

    processInvite();

    // Cleanup messages on unmount
    return () => {
      dispatch(clearInviteMessages());
    };
  }, [inviteToken, dispatch, navigate]);

  const isSuccess = message === "You have successfully joined the project";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border">
        <div className="text-center">
          {isProcessing ? (
            <>
              {/* Loading spinner */}
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              <h2 className="mt-4 text-xl font-semibold">
                Processing invitation...{" "}
              </h2>
            </>
          ) : (
            <>
              {/* Success/Error icon */}
              <div
                className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                  isSuccess ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {isSuccess ? (
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>

              <h2 className="mt-4 text-xl font-semibold">
                {isSuccess ? "Success!" : "Error"}
              </h2>

              <p className="mt-2 text-gray-600">{message}</p>

              {/* Action buttons */}
              <div className="mt-6 space-x-3">
                <button
                  onClick={() => navigate("/projects")}
                  className="inline-flex justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Go to Projects
                </button>

                {!isSuccess && (
                  <button
                    onClick={() => navigate("/")}
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Go to Home
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptInvite;
