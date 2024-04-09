import { useEffect } from 'react';
import { useRouter } from 'next/router';

function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/challenges');
  }, [router]);

  return null; // Ou un indicateur de chargement pendant que la redirection est en cours
}

export default Home;
