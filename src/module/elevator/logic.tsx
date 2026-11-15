import { useEffect, useState } from 'react';
import { type PropsWithChildren, createContext, useContext } from 'react';
import { exhaustiveGuard } from '../../lib/exhaustive-guard';

type Floor = {
  id: string;
};

interface ElevatorControlPanel {
  // prettier-ignore
  elevatorState:
    | 'open'
    | 'closed-and-idle'
    | 'opening'
    | 'closing'
    | 'moving-up'
    | 'moving-down'
    | 'waiting-on-door'
    | 'panic'

  currentFloor: Floor['id'] | null;
  queue: Array<Floor['id']>;
  floorArray: Array<Floor>;
  totalFloors: number;

  doorCloseTimeout: number;
  openDoor: () => void;
  closeDoor: () => void;

  panic: () => void;

  pickFloor: (args: { floorId: Floor['id'] }) => void;
  unpickFloor: (args: { floorId: Floor['id'] }) => void;

  isQueuedFloor: (args: { floorId: Floor['id'] }) => boolean;
}

const FLOOR_ARRAY: Array<Floor> = [
  { id: '1' },
  { id: '2' },
  { id: '3' },
  { id: '4' },
  { id: '5' },
  { id: '6' },
  { id: '7' },
  { id: '8' },
  { id: '9' },
];

const ElevatorContext = createContext<ElevatorControlPanel | null>(null);

export const useElevatorContext = (): ElevatorControlPanel => {
  const context = useContext(ElevatorContext);
  if (!context) throw new Error('Could not find context ElevatorContext');
  return context;
};

export const ElevatorContextProvider = ({ children }: PropsWithChildren) => {
  const [elevatorState, setElevatorState] = useState<ElevatorControlPanel['elevatorState']>('closed-and-idle');

  const [currentFloor, setCurrentFloor] = useState<Floor['id'] | null>(FLOOR_ARRAY?.[0].id ?? null);
  const [queue, setQueue] = useState<ElevatorControlPanel['queue']>([]);

  const [doorCloseTimeout, setDoorCloseTimeout] = useState(0);

  const openDoor = () => {
    switch (elevatorState) {
      case 'waiting-on-door':
      case 'closing':
      case 'closed-and-idle':
        setElevatorState('opening');
        break;

      case 'open':
      case 'opening':
      case 'moving-down':
      case 'moving-up':
      case 'panic':
        break;

      default:
        return exhaustiveGuard(elevatorState);
    }
  };

  const closeDoor = () => {
    switch (elevatorState) {
      case 'waiting-on-door':
      case 'open':
      case 'opening':
        setElevatorState('closing');
        break;

      case 'closing':
      case 'closed-and-idle':
      case 'moving-down':
      case 'moving-up':
      case 'panic':
        break;

      default:
        return exhaustiveGuard(elevatorState);
    }
  };

  const pickFloor: ElevatorControlPanel['pickFloor'] = (args) => {
    setQueue((q) => Array.from(new Set([...q, args.floorId])));
  };
  const unpickFloor: ElevatorControlPanel['unpickFloor'] = (args) => {
    setQueue((q) => q.filter((floorId) => floorId !== args.floorId));
  };

  const panic = () => {
    // TODO:
  };

  const isQueuedFloor: ElevatorControlPanel['isQueuedFloor'] = (args) => {
    return queue.some((floorId) => floorId === args.floorId);
  };

  // queue consumer
  useEffect(function takeNextQueueItem() {
    // TODO:
  }, []);

  return (
    <ElevatorContext.Provider
      value={{
        elevatorState,

        currentFloor,
        queue,

        floorArray: FLOOR_ARRAY,
        totalFloors: FLOOR_ARRAY.length,

        doorCloseTimeout,

        openDoor,
        closeDoor,
        pickFloor,
        unpickFloor,
        panic,
        isQueuedFloor,
      }}
    >
      {children}
    </ElevatorContext.Provider>
  );
};
