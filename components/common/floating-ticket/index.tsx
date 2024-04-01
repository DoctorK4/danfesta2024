'use client';

import Link from 'next/link';
import { BsTicketFill } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';

const MotionLink = motion(Link);

export default function FloatingTicket() {
  const locale = useLocale();

  return (
    <MotionLink
      href={`/${locale}/my-tickets`}
      className='fixed bottom-4 right-4 p-4 bg-primary text-white rounded-full shadow-lg z-50'
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, y: 100 }}
      animate={{ scale: 1, y: 0 }}
    >
      <BsTicketFill size={25} />
    </MotionLink>
  );
}
