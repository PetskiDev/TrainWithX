import NavBar from '@frontend/components/NavBar';
import { Toaster } from '@frontend/components/ui/toaster';
import RootRouter from '@frontend/RootRouter';

function App() {
  return (
    <>
      <NavBar />
      <Toaster />
      <RootRouter />
    </>
  );
}

export default App;
