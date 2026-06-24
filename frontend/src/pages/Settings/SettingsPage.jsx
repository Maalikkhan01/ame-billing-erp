import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";

import {
  getProfile,
  updateProfile,
  changePassword,
} from "../../services/userService";

import "./SettingsPage.css";

function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "",
    mobile: "",
    role: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const data = await getProfile();

    setProfile(data.user);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    await updateProfile({
      name: profile.name,
      mobile: profile.mobile,
    });

    alert("Profile Updated");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert("Passwords do not match");
    }

    await changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });

    alert("Password Updated");

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <MainLayout>
      <h1>Settings</h1>

      <div className="settings-card">
        <h2>Profile</h2>

        <form onSubmit={handleProfileUpdate}>
          <input
            type="text"
            value={profile.name}
            onChange={(e) =>
              setProfile({
                ...profile,
                name: e.target.value,
              })
            }
            placeholder="Name"
          />

          <input
            type="text"
            value={profile.mobile}
            onChange={(e) =>
              setProfile({
                ...profile,
                mobile: e.target.value,
              })
            }
            placeholder="Mobile"
          />

          <input type="text" value={profile.role} disabled />

          <button type="submit">Update Profile</button>
        </form>
      </div>

      <div className="settings-card">
        <h2>Change Password</h2>

        <form onSubmit={handlePasswordChange}>
          <input
            type="password"
            placeholder="Current Password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                currentPassword: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="New Password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                newPassword: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                confirmPassword: e.target.value,
              })
            }
          />

          <button type="submit">Change Password</button>
        </form>
      </div>
    </MainLayout>
  );
}

export default SettingsPage;
