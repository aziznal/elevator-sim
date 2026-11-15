type Floor = {
};

interface ElevatorControlPanel {
  currentFloor: number;
  destinationFloors: Array<number>;
  floorArray: Array<Floor>;

  openDoor: () => void;
  closeDoor: () => void;
  pickFloor: (floorNumber: number) => void;
  panic: () => void;
}

export class Elevator {
  currentFloor: number = 0;
  destinationFloors: Array<number> = [];
  totalFloors: number = 0;

  // to track how faralong the elevator is
  _motionTimeout: number = 0;

  function openDoor() { }

  function closeDoor() { }

  function pickFloor() { }

  function panic() { }
}
