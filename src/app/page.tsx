
import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to the signin page by default
  redirect('/signin');
}
