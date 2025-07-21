import Footer from '@frontend/components/Footer';
import NavBar from '@frontend/components/NavBar';
import { ScrollToTop } from '@frontend/components/ScrollToTop';
import { Toaster } from '@frontend/components/ui/toaster';
import RootRouter from '@frontend/RootRouter';

function App() {
  return (
    <>
      <NavBar />
      <Toaster />
      <ScrollToTop />
      <RootRouter />
      <Footer />
    </>
  );
}

export default App;
