import { redirect } from 'next/navigation';

export default function RootPage() {
  // This automatically redirects users from the root "/" URL to "/home"
  redirect('/home');
}