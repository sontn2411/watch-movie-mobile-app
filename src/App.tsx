import React from 'react';
import './styles/global.css'; // Global styles
import RootLayout from '@/components/RootLayout';
import RootNavigator from '@/navigation/RootNavigator';

function App() {
  return (
    <RootLayout>
      <RootNavigator />
    </RootLayout>
  );
}

export default App;
