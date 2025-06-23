import { Container } from '@mui/material';
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Container >
        <h1>Hello TrainWithX</h1>
      </Container>
    </>
  );
}

export default App;
