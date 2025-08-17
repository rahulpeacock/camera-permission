import { cn } from '@/lib/utils';
import React from 'react';

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

const MAX_BARS = 100;
const resolution = 32; // ms
const scalingFactor = 300;

interface AudioWaveformProps {
  analyserNode: AnalyserNode | null;
  isPaused: boolean;
}

export function AudioWaveform({ analyserNode, isPaused }: AudioWaveformProps) {
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const barsContainerRef = React.useRef<HTMLDivElement | null>(null);

  const [bars, setBars] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (!analyserNode) {
      setBars(Array(MAX_BARS).fill(-1));
      return;
    }
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const captureAmplitude = () => {
      analyserNode.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        const sample = (dataArray[i] - 128) / 128;
        sum += sample * sample;
      }
      const rms = Math.sqrt(sum / bufferLength);
      React.startTransition(() => {
        setBars((prev) => {
          const newBars = [...prev, rms];
          const slicedBars = newBars.slice(-MAX_BARS);
          if (slicedBars.length < MAX_BARS) {
            return [...Array(MAX_BARS - slicedBars.length).fill(-1), ...slicedBars];
          }
          return slicedBars;
        });
      });
    };

    intervalRef.current = setInterval(captureAmplitude, resolution);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [analyserNode]);

  return (
    <div className='flex h-8 items-center gap-[2px] w-full justify-center' ref={barsContainerRef}>
      {bars.map((amplitude, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={index}
          className={cn('w-[2px]', isPaused ? 'bg-gray-100' : amplitude >= 0 ? 'bg-gray-600' : 'bg-gray-200')}
          style={{
            height: `${clamp(amplitude * scalingFactor, 2, 32)}px`,
          }}
        />
      ))}
    </div>
  );
}
