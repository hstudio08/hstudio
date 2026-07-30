import MyExpertBookingPage from '../../../../../components/MyExpertBookingPage';

export const metadata = {
  title: 'Web Booking — MyExpert 30% Payback Special Offer | Qurevo Technologies',
  description: 'Book your high-performance website with Qurevo Technologies and claim 30% payback sponsored by MyExpert.',
  robots: {
    index: false,
    follow: false,
  },
};

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function MyExpertCollabPage({ params }: PageProps) {
  const { slug } = await params;
  return <MyExpertBookingPage slug={slug} />;
}
