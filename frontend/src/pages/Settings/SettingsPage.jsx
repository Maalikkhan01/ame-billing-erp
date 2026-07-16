import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import FormField from "../../components/ui/FormField";
import Button from "../../components/ui/Button";

import BackupCard from "../../components/backup/BackupCard";

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
      <PageHeader
        title="Settings"
        subtitle="Manage profile and account security"
      />

      <div className="settings-page">
        <Card title="Profile">
          <form className="settings-form" onSubmit={handleProfileUpdate}>
            <FormField
              value={profile.name}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  name: e.target.value,
                })
              }
              placeholder="Name"
            />

            <FormField
              value={profile.mobile}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  mobile: e.target.value,
                })
              }
              placeholder="Mobile"
            />

            <FormField value={profile.role} disabled />

            <Button type="submit">Update Profile</Button>
          </form>
        </Card>

        <Card title="Change Password">
          <form className="settings-form" onSubmit={handlePasswordChange}>
            <FormField
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

            <FormField
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

            <FormField
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

            <Button type="submit">Change Password</Button>
          </form>
        </Card>

        <BackupCard />
      </div>
    </MainLayout>
  );
}

export default SettingsPage;
