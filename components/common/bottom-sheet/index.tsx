'use client';

import clsx from 'clsx';
import {
  AnimatePresence,
  motion,
  PanInfo,
  useDragControls,
} from 'framer-motion';
import { PointerEvent, useEffect, useState } from 'react';

import { variants, transition } from './motion';
import Overlay from '../overlay';
import { Height } from './types';
import { cn } from '@/lib/utils';
import { isPWA } from '@/lib/utils/device/isPWA';

export interface BottomSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onDismiss: () => void;
  header?: React.ReactNode | string;
  height?: Height;
  expandTo?: Height;
}

const DRAG_TRESHOLD = 5;

export default function BottomSheet({
  isOpen,
  children,
  header,
  height = 'auto',
  expandTo,
  onDismiss,
}: BottomSheetProps) {
  const controls = useDragControls();
  const [dragging, setDragging] = useState(false);
  const [touching, setTouching] = useState(false);
  const [currentHeight, setCurrentHeight] = useState<Height>(height);

  const startDrag = (e: PointerEvent<HTMLDivElement>) => {
    controls.start(e);
    setDragging(true);
  };

  const handleDragend = (_: Event, info: PanInfo) => {
    if (info.offset.y > DRAG_TRESHOLD) onDismiss();
    else if (info.offset.y < -DRAG_TRESHOLD) expand();

    setDragging(false);
  };

  const expand = () => {
    if (expandTo !== undefined && height !== 'auto') setCurrentHeight(expandTo);
  };

  useEffect(() => {
    if (!isOpen) setCurrentHeight(height);
  }, [isOpen, height]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className='relative h-full w-full touch-none'>
          <motion.div
            drag
            dragConstraints={{
              top: 0,
              bottom: 99999,
              left: 0,
              right: 0,
            }}
            dragElastic={0.1}
            dragControls={controls}
            dragListener={false}
            onDragEnd={handleDragend}
            initial='hidden'
            animate={touching ? 'smaller' : 'visible'}
            exit='hidden'
            variants={variants.bottomSheet.container}
            transition={transition.container}
            className={cn(
              'z-50 fixed bg-white dark:bg-neutral-900 rounded-2xl bottom-4 left-4 right-4 box-border px-7 transition-[top] overflow-hidden shadow-xl',
              isPWA ? 'bottom-10' : 'bottom-4'
            )}
          >
            <div
              onPointerDown={startDrag}
              onTouchStart={() => setTouching(true)}
              onTouchEnd={() => setTouching(false)}
              className='flex justify-center flex-col'
            >
              <motion.div className='w-[50px] h-1 mx-auto mt-2 mb-10 bg-neutral-300 dark:bg-neutral-700 rounded-full' />
              {!!header && (
                <motion.h2
                  initial='initial'
                  animate='animate'
                  variants={variants.bottomSheet.content}
                  transition={transition.content}
                  className='mb-7 text-xl font-bold text-neutral-900 dark:text-neutral-100'
                >
                  {header}
                </motion.h2>
              )}
            </div>
            <motion.div
              initial='initial'
              animate='animate'
              variants={variants.bottomSheet.content}
              transition={transition.content}
              className={clsx(
                'w-full transition-[height] touch-pan-x touch-pan-y',
                currentHeight === 'auto' && 'h-auto',
                currentHeight === '1/3' && 'h-[33svh]',
                currentHeight === '2/3' && 'h-[66svh]',
                height !== 'auto' && expandTo !== undefined
                  ? 'overflow-scroll pb-0'
                  : 'overflow-hidden pb-7'
              )}
            >
              {children}
            </motion.div>
          </motion.div>
          <Overlay onClick={onDismiss} darker={dragging} />
        </div>
      )}
    </AnimatePresence>
  );
}
