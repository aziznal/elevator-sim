import { useId } from 'react';
import { cn } from '../cn';

export const BrailleNumber = (props: { num: number }) => {
  const id = useId();

  return (
    <div className="flex gap-1.5">
      <div className="grid grid-cols-2 gap-0.5">
        {Array.from([0, 0, 0, 0, 0, 0]).map((_, index) => (
          <Braillette
            key={`braillette-col-1-${id}-${index}`}
            isUp={ENCODINGS[props.num].col1[Math.floor(index / 2)][index % 2] === 1}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-0.5">
        {Array.from([0, 0, 0, 0, 0, 0]).map((_, index) => (
          <Braillette
            key={`braillette-col-2-${id}-${index}`}
            isUp={ENCODINGS[props.num].col2[Math.floor(index / 2)][index % 2] === 1}
          />
        ))}
      </div>
    </div>
  );
};

const Braillette = (props: { isUp: boolean }) => {
  return <div className={cn('size-[0.1rem] rounded-full invisible', props.isUp && ' bg-gray-400 visible')} />;
};

const ENCODINGS: Record<number, { col1: number[][]; col2: number[][] }> = {
  0: {
    col1: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    col2: [
      [0, 1],
      [1, 1],
      [0, 0],
    ],
  },
  1: {
    col1: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    col2: [
      [1, 0],
      [0, 0],
      [0, 0],
    ],
  },
  2: {
    col1: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    col2: [
      [1, 0],
      [1, 0],
      [0, 0],
    ],
  },
  3: {
    col1: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    col2: [
      [1, 1],
      [0, 0],
      [0, 0],
    ],
  },
  4: {
    col1: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    col2: [
      [1, 1],
      [0, 1],
      [0, 0],
    ],
  },
  5: {
    col1: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    col2: [
      [1, 0],
      [0, 1],
      [0, 0],
    ],
  },
  6: {
    col1: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    col2: [
      [1, 1],
      [1, 0],
      [0, 0],
    ],
  },
  7: {
    col1: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    col2: [
      [1, 1],
      [1, 1],
      [0, 0],
    ],
  },
  8: {
    col1: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    col2: [
      [1, 0],
      [1, 1],
      [0, 0],
    ],
  },
  9: {
    col1: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    col2: [
      [0, 1],
      [1, 0],
      [0, 0],
    ],
  },
};
