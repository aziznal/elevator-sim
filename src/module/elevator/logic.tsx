import { useEffect, useState } from 'react';
import { type PropsWithChildren, createContext, useContext } from 'react';
import { exhaustiveGuard } from '../../lib/exhaustive-guard';

type Floor = {
  id: number;
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

  // a method to act as a replacement to the sensor and circuitry that actually
  // detect an elevator's position and other stuff
  reportSensorState: (args: {
    state:
      | { name: 'door-fully-closed' }
      | { name: 'door-fully-opened' }
      // e.g. when someone puts their hand in the door as it closes
      | { name: 'motion-sensor-detected' }
      | { name: 'floor-reached'; floorId: Floor['id'] };
  }) => void;

  currentFloor: Floor['id'] | null;
  nextTargetFloor: Floor['id'] | null;
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
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
];

const ELEVATOR_DOOR_CLOSE_TIMEOUT_MS = 5_000;

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
    // check previous state:

    // appropriate to open door
    switch (elevatorState) {
      case 'waiting-on-door':
      case 'closing':
      case 'closed-and-idle':
        setElevatorState('opening');
        break;

      // redundant
      case 'open':
      case 'opening':

      // dangerous
      case 'moving-down':
      case 'moving-up':

      // traumatizing
      case 'panic':
        break;

      default:
        return exhaustiveGuard(elevatorState);
    }
  };

  const closeDoor = () => {
    switch (elevatorState) {
      // check previous state

      // appropriate to close
      case 'waiting-on-door':
      case 'open':
      case 'opening':
        setElevatorState('closing');
        break;

      // redundant
      case 'closing':
      case 'closed-and-idle':

      // dangerous
      case 'moving-down':
      case 'moving-up':

      // traumatizing
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

  useEffect(() => {
    console.log(queue);
  }, [queue]);

  const panic = () => {
    // TODO:
  };

  const isQueuedFloor: ElevatorControlPanel['isQueuedFloor'] = (args) => {
    return queue.some((floorId) => floorId === args.floorId);
  };

  const gotoNextQueued = () => {
    console.log(queue);
    // TODO:
  };

  const autoCloseDoor = () => {
    const timeout = setTimeout(() => {
      setElevatorState('closing');
    }, ELEVATOR_DOOR_CLOSE_TIMEOUT_MS);
    setDoorCloseTimeout(timeout);
  };

  const reportSensorState: ElevatorControlPanel['reportSensorState'] = (args) => {
    const stateName = args.state.name;

    switch (stateName) {
      case 'door-fully-closed':
        // if queue has floors, go to them
        if (queue.length > 0) {
          setElevatorState('moving-down');
          gotoNextQueued();
          break;
        }

        // otherwise, we just closed cuz we're chillin
        setElevatorState('closed-and-idle');
        break;

      case 'door-fully-opened':
        setElevatorState('open');
        autoCloseDoor();
        break;

      case 'floor-reached':
        setCurrentFloor(args.state.floorId);
        setElevatorState('opening');
        setQueue((q) => q.slice(1));
        break;

      case 'motion-sensor-detected':
        break;

      default:
        return exhaustiveGuard(stateName);
    }
  };

  return (
    <ElevatorContext.Provider
      value={{
        elevatorState,
        currentFloor,
        queue,
        nextTargetFloor: queue.at(0) ?? null,
        floorArray: FLOOR_ARRAY,
        totalFloors: FLOOR_ARRAY.length,
        doorCloseTimeout,

        reportSensorState,
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
