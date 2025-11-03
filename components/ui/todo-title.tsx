import { formatISODate } from '@/app/_utils/dateUtils';
import { Todo } from '@/types/todo';
import { Box, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import React, { useRef, useState } from 'react';

function TodoTitle({ t }: { t: Todo }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [translateX, setTranslateX] = useState(0);

  const handleMouseEnter = () => {
    if (!containerRef.current || !textRef.current) return;
    console.log(containerRef.current.offsetWidth, textRef.current.scrollWidth);

    const containerWidth = containerRef.current.offsetWidth;
    const textWidth = textRef.current.scrollWidth;

    if (textWidth > containerWidth) {
      setTranslateX(-(textWidth - containerWidth));
    }
  };

  const handleMouseLeave = () => {
    if (!containerRef.current || !textRef.current) return;
    setTranslateX(0); // return to start
  };
  return (
    <Link
      href={`${process.env.NEXT_PUBLIC_API_URL_FRONTEND}/${t.id}`}
      style={{ width: '100%' }}
    >
      <Flex align="center">
        <Box
          margin="0 auto 0 0"
          ref={containerRef}
          position="relative"
          w="100%"
          whiteSpace="nowrap"
          overflow="hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Box
            as="span"
            ref={textRef}
            display="inline-block"
            transition="transform 2s linear"
            transform={`translateX(${translateX}px)`}
          >
            {t.title}
          </Box>
        </Box>
        <Box marginRight="3rem" marginLeft="1rem" width="100%">
          {formatISODate(t.date)}
        </Box>
      </Flex>
    </Link>
  );
}

export default TodoTitle;
