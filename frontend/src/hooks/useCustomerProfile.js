import { useEffect, useState } from "react";

import { getCustomerProfile } from "../services/customerProfileService";

const useCustomerProfile = (customerId) => {
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const data = await getCustomerProfile(customerId);

      setProfile(data);
    } catch (error) {
      setProfile(null);

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  return {
    profile,
    loading,
    refreshProfile: loadProfile,
  };
};

export default useCustomerProfile;
