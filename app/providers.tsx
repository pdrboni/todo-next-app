'use client';
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from './get-query-client';
import { Provider } from '@/components/ui/provider';
import { ColorModeButton } from '@/components/ui/color-mode';

function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <Provider>
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          paddingTop: '5rem',
        }}
      >
        <ColorModeButton />
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </div>
    </Provider>
  );
}

export default Providers;
