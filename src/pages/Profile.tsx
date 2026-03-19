import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectIsAuthenticated } from "../features/auth/slice/authSlice";
import ProfileForm from "../features/auth/components/ProfileForm";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [dispatch, isAuthenticated, navigate]);

  return <ProfileForm />;
};

export default Profile;