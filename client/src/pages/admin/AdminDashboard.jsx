import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  logOutStart,
  logOutSuccess,
  logOutFailure,
  deleteUserAccountStart,
  deleteUserAccountSuccess,
  deleteUserAccountFailure,
} from "../../redux/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import AllBookings from "./AllBookings";
import AdminUpdateProfile from "./AdminUpdateProfile";
import AddPackages from "./AddPackages";
import "./styles/DashboardStyle.css";
import AllPackages from "./AllPackages";
import AllUsers from "./AllUsers";
import Payments from "./Payments";
import RatingsReviews from "./RatingsReviews";
import History from "./History";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [activePanelId, setActivePanelId] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    avatar: null,
  });

  useEffect(() => {
    if (currentUser !== null) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        address: currentUser.address,
        phone: currentUser.phone,
        avatar: currentUser.avatar,
      });
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      dispatch(logOutStart());
      const res = await fetch("/api/auth/logout");
      const data = await res.json();
      if (data?.success !== true) {
        dispatch(logOutFailure(data?.message));
        return;
      }
      dispatch(logOutSuccess());
      navigate("/login");
      toast.success(t("admin.dashboard.messages.logoutSuccess"));
    } catch (error) {}
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const CONFIRM = confirm(t("admin.dashboard.messages.confirmDelete"));
    if (CONFIRM) {
      try {
        dispatch(deleteUserAccountStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data?.success === false) {
          dispatch(deleteUserAccountFailure(data?.message));
          toast.error(t("admin.dashboard.errors.general"));
          return;
        }
        dispatch(deleteUserAccountSuccess());
        toast.success(t("admin.dashboard.messages.deleteSuccess"));
      } catch (error) {}
    }
  };

  return (
    <div className="flex w-full flex-wrap max-sm:flex-col gap-16 p-2">
      {currentUser ? (
        <>
          {/* LEFT SIDEBAR */}
          <div className="w-[25%] p-3 max-sm:w-full">
            <div className="flex flex-col items-center gap-4 p-3 rounded-lg shadow-lg">
              <div className="w-full flex flex-col items-center relative">
                <img
                  src={`${formData.avatar}`}
                  alt={t("admin.dashboard.labels.profilePhoto")}
                  className="w-36 h-36 object-cover rounded-full"
                />
              </div>

              <p className="w-full text-center border-b">
                <span className="font-semibold">
                  {t("admin.dashboard.labels.loggedInUser")}
                </span>
              </p>

              <div className="w-full flex justify-between px-1">
                <button
                  onClick={() => setActivePanelId(8)}
                  className="px-8 bg-[#EB662B] text-white font-semibold rounded-lg p-1"
                >
                  {t("admin.dashboard.actions.editProfile")}
                </button>
              </div>

              <div className="w-full flex flex-col gap-3 shadow-2xl rounded-lg p-3 break-all">
                <p>{t("admin.dashboard.labels.name")}</p>
                <p className="border p-2">{currentUser.username}</p>

                <p>{t("admin.dashboard.labels.email")}</p>
                <p className="border p-2">{currentUser.email}</p>

                <p>{t("admin.dashboard.labels.phone")}</p>
                <p className="border p-2">{currentUser.phone}</p>

                <p>{t("admin.dashboard.labels.address")}</p>
                <p className="border p-2">{currentUser.address}</p>

                <div className="flex justify-between">
                  <button
                    onClick={handleLogout}
                    className="px-4 bg-[#6358DC] text-white rounded-lg p-1"
                  >
                    {t("admin.dashboard.actions.logout")}
                  </button>

                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 bg-[#EB662B] text-white rounded-lg p-1"
                  >
                    {t("admin.dashboard.actions.deleteAccount")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="w-[65%] max-sm:w-full">
            <div className="main-div">
              <nav className="w-full border-b-4 border-[#EB662B] py-3 overflow-x-auto navbar">
                <div className="flex gap-2">
                  <button
                    className={
                      activePanelId === 1
                        ? "p-1 bg-[#EB662B] text-white rounded-t"
                        : "p-1"
                    }
                    onClick={() => setActivePanelId(1)}
                  >
                    {t("admin.dashboard.tabs.bookings")}
                  </button>

                  <button
                    className={
                      activePanelId === 2
                        ? "p-1 bg-[#EB662B] text-white rounded-t"
                        : "p-1"
                    }
                    onClick={() => setActivePanelId(2)}
                  >
                    {t("admin.dashboard.tabs.addPackages")}
                  </button>

                  <button
                    className={
                      activePanelId === 3
                        ? "p-1 bg-[#EB662B] text-white rounded-t"
                        : "p-1"
                    }
                    onClick={() => setActivePanelId(3)}
                  >
                    {t("admin.dashboard.tabs.allPackages")}
                  </button>

                  <button
                    className={
                      activePanelId === 4
                        ? "p-1 bg-[#EB662B] text-white rounded-t"
                        : "p-1"
                    }
                    onClick={() => setActivePanelId(4)}
                  >
                    {t("admin.dashboard.tabs.users")}
                  </button>

                  <button
                    className={
                      activePanelId === 5
                        ? "p-1 bg-[#EB662B] text-white rounded-t"
                        : "p-1"
                    }
                    onClick={() => setActivePanelId(5)}
                  >
                    {t("admin.dashboard.tabs.payments")}
                  </button>

                  <button
                    className={
                      activePanelId === 6
                        ? "p-1 bg-[#EB662B] text-white rounded-t"
                        : "p-1"
                    }
                    onClick={() => setActivePanelId(6)}
                  >
                    {t("admin.dashboard.tabs.ratingsReviews")}
                  </button>

                  <button
                    className={
                      activePanelId === 7
                        ? "p-1 bg-[#EB662B] text-white rounded-t"
                        : "p-1"
                    }
                    onClick={() => setActivePanelId(7)}
                  >
                    {t("admin.dashboard.tabs.history")}
                  </button>
                </div>
              </nav>

              <div className="content-div flex flex-wrap my-5">
                {activePanelId === 1 ? (
                  <AllBookings />
                ) : activePanelId === 2 ? (
                  <AddPackages />
                ) : activePanelId === 3 ? (
                  <AllPackages />
                ) : activePanelId === 4 ? (
                  <AllUsers />
                ) : activePanelId === 5 ? (
                  <Payments />
                ) : activePanelId === 6 ? (
                  <RatingsReviews />
                ) : activePanelId === 7 ? (
                  <History />
                ) : activePanelId === 8 ? (
                  <AdminUpdateProfile />
                ) : (
                  <div>{t("admin.dashboard.errors.pageNotFound")}</div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-red-700">{t("admin.dashboard.errors.loginFirst")}</p>
      )}
    </div>
  );
};

export default AdminDashboard;
