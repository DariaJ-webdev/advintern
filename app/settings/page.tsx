import { Suspense } from 'react';
import Settings from '../../components/Settings';

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading Settings...</div>}>
      <Settings />
    </Suspense>
  );
}