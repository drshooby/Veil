import VideoUpload from '@/components/VideoUpload';
import Image from 'next/image';

const Home = () => {
  return (
    <div className="container">
      <h1>Veil</h1>
      <VideoUpload/>
    </div>
  );
};

export default Home;
