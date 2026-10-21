import React from 'react';
import { AppShell } from './components/layout/AppShell';
import { InteractiveCursor } from './components/ui/InteractiveCursor';

export function App() {
  return (
    <>
      <InteractiveCursor />
      <AppShell />
    </>
  );
}

export default App;
