import { getDuration } from '@/features/media-stream/utils';
import React from 'react';

interface MicrophoneTimerProps {
  startTimer: boolean;
}

export const MicrophoneTimer = React.memo(({ startTimer }: MicrophoneTimerProps) => {
  const [time, setTime] = React.useState(0);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (startTimer) {
      intervalRef.current = setInterval(() => {
        setTime((curr) => curr + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startTimer]);

  return <p className='font-medium text-[13px] tabular-nums'>{getDuration(time)}</p>;
});
