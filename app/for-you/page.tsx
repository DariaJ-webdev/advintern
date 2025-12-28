import { Suspense } from 'react';/*For Vercel Deployment*/
// Import the component but give it a slightly different local name
import ForYouComponent from '../../components/ForYou'; 

export default function ForYouPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Use the different name here */}
      <ForYouComponent />
    </Suspense>
  );
}