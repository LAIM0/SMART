import React, { useEffect } from 'react';
import { handleAuthRouting } from '../../api/AuthApiManager';
import { useRouter } from 'next/router';

function Profile() {
  const router = useRouter();
  useEffect(() => {
    handleAuthRouting(router);
  }, []);

  return <div>Profil</div>;
}

export default Profile;