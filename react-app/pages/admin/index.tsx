import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/challenges');
  }, [router]);

  return null;
};

export default Home;
