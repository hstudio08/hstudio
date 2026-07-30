import MyExpertBookingPage from '../../../../components/MyExpertBookingPage';

export const metadata = {
  title: 'Web Booking — MyExpert 30% Payback Special Offer | Qurevo Technologies',
  description: 'Book your high-performance website with Qurevo Technologies and claim 30% payback sponsored by MyExpert.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyExpertCollabRootPage() {
  return <MyExpertBookingPage slug="default" />;
}
