import VideoUpload from '@/components/VideoUpload';
import Image from 'next/image';

const Home = () => {
  return (
    <div className="container">
      <h1>Veil</h1>
      {/* <Image src="/VeilA.png" alt="Veil Logo" width={240} height={240} /> */}
      <VideoUpload/>
    </div>
  );
};

export default Home;
