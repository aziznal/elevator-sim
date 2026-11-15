import { LucideChevronLeft, LucideChevronRight, LucideSkull } from 'lucide-react';
import { cn } from '../../lib/cn';
import { ElevatorContextProvider, useElevatorContext } from './logic';
import { motion, spring } from 'motion/react';
import { BrailleNumber } from '../../lib/components/BrailleNumber';

export const Elevator = () => {
  return (
    <ElevatorContextProvider>
      <ElevatorInternal />
    </ElevatorContextProvider>
  );
};

export const ElevatorInternal = () => {
  const {} = useElevatorContext();

  return (
    <div className="flex gap-4">
      <Section>
        <Section.Title>Simulation</Section.Title>

        <div className="w-[18rem] h-full">
          <ElevatorVisualSimulation />
        </div>
      </Section>

      <Section>
        <Section.Title>Control Panel</Section.Title>

        <div className="w-[13rem]">
          <ControlPanel />
        </div>
      </Section>
    </div>
  );
};

const ControlPanel = () => {
  const { elevatorState, currentFloor, floorArray, pickFloor, unpickFloor, isQueuedFloor } = useElevatorContext();

  return (
    <div className="">
      {/* Helpful display */}
      <div className="h-[6.5rem] border rounded-lg mb-4 bg-gray-950 font-mono text-center flex flex-col items-center justify-center p-1.5">
        <span className="flex-1 flex items-center justify-center text-5xl tabular-nums font-bold elevator-display-font">
          {currentFloor?.padStart(2, '0')}
        </span>

        {/* Indicator Grid */}
        <div className="flex gap-0.5 items-center">
          {/* Door indicator: opening */}
          <ControlPanelDisplayIndicator isActive={elevatorState === 'opening'}>
            <LucideChevronLeft />
            <LucideChevronRight className="-ml-1.5" />
          </ControlPanelDisplayIndicator>

          {/* Door indicator: closing */}
          <ControlPanelDisplayIndicator isActive={elevatorState === 'closing'}>
            <LucideChevronRight />
            <LucideChevronLeft className="-ml-1.5" />
          </ControlPanelDisplayIndicator>

          {/* death */}
          <ControlPanelDisplayIndicator>
            <LucideSkull />
          </ControlPanelDisplayIndicator>
        </div>
      </div>

      {/* Button grid */}
      <div className="flex flex-wrap gap-2 w-fit items-center justify-center">
        {floorArray.map((floor) => (
          <div key={`floor-button-${floor.id}`} className="flex flex-col gap-1 items-center justify-center">
            <div className="shadow-[0rem_0.1rem] rounded-full bg-gray-400 p-1">
              <button
                className={cn(
                  'size-12 rounded-full outline-2 font-bold cursor-pointer active:translate-y-[0.1rem] translate-y-[0rem] transition-[translate,scale] active:scale-[98%] flex flex-col items-center',
                  !isQueuedFloor({ floorId: floor.id }) && 'outline-gray-500 text-gray-100 bg-gray-700',
                  isQueuedFloor({ floorId: floor.id }) && 'outline-yellow-500 text-amber-700 bg-amber-200',
                )}
                onClick={() => pickFloor({ floorId: floor.id })}
                onDoubleClick={() => unpickFloor({ floorId: floor.id })}
              >
                <span className="text-2xl mt-1">{floor.id}</span>
                <BrailleNumber num={Number(floor.id)} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ControlPanelDisplayIndicator = (props: { children: React.ReactNode; isActive?: boolean }) => {
  return (
    <div
      className={cn(
        'border-2 h-[1.25rem] w-[2rem] rounded-xs p-1 flex items-center justify-center [&_svg]:shrink-0 [&_svg]:size-4 [&_svg]:stroke-3',
        !props.isActive && 'text-slate-700',
        props.isActive && 'text-slate-300',
      )}
    >
      {props.children}
    </div>
  );
};

const ElevatorVisualSimulation = () => {
  const { floorArray, elevatorState, openDoor, closeDoor, reportSensorState } = useElevatorContext();

  return (
    <div className="flex flex-col items-center h-full">
      {/* building */}
      <div className="h-full border-b-0 border-2 rounded-t-xl w-[80%] flex gap-3 pt-4">
        {/* floors */}
        <div className="pt-4 ps-4 flex flex-col gap-5">
          <div className="flex flex-col gap-7">
            {floorArray
              // to make it start highest to lowest in rendering
              .toReversed()
              // ground floor is handled differently, so skip it
              .slice(1)
              .map((floor) => (
                <div key={`floor-in-bulding-${floor.id}`} className="flex gap-5">
                  <div className="h-[2rem] w-[1.5rem] border rounded-sm"></div>
                  <div className="h-[2rem] w-[1.5rem] border rounded-sm"></div>
                  <div className="h-[2rem] w-[1.5rem] border rounded-sm"></div>
                </div>
              ))}
          </div>

          {/* entrance */}
          <div className="flex gap-3 self-center">
            <div className="flex items-center justify-center gap-1 h-[4rem] w-[3rem] border rounded-sm rounded-b-none border-b-none font-bold">
              <span>.</span>
              <span className="h-full w-px bg-white" />
              <span>.</span>
            </div>
          </div>
        </div>

        {/* elevator */}
        <div className="h-full border-l border-l-gray-800 w-full rounded-tr-xl px-3">
          {/* chamber */}
          <div
            className="border border-gray-600 h-[3rem] flex cursor-pointer overflow-x-clip"
            onClick={elevatorState !== 'opening' ? openDoor : closeDoor}
          >
            {/* left door */}
            <motion.div
              className="w-[50%] h-full bg-gray-500 border-r border-r-gray-600"
              animate={elevatorState === 'opening' ? 'open' : 'closed'}
              variants={{
                open: {
                  translateX: '-1rem',
                  transition: {
                    ease: 'easeInOut',
                    duration: 2,
                  },
                },
                closed: {
                  translateX: '0rem',
                  transition: {
                    ease: 'easeInOut',
                    duration: 2,
                  },
                },
              }}
            />

            {/* right door */}
            <motion.div
              className="w-[50%] h-full bg-gray-500"
              animate={elevatorState === 'opening' ? 'open' : 'closed'}
              variants={{
                open: {
                  translateX: '1rem',
                  transition: {
                    ease: 'easeInOut',
                    duration: 2,
                  },
                },
                closed: {
                  translateX: '0rem',
                  transition: {
                    ease: 'easeInOut',
                    duration: 2,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* outside floor */}
      <hr className="w-full" />
    </div>
  );
};

const Section = (props: { children: React.ReactNode }) => {
  return <div className="flex flex-col min-h-0 border rounded-lg p-4">{props.children}</div>;
};

const SectionTitle = (props: { children: React.ReactNode }) => {
  return <h2 className="opacity-50 text-lg italic text-center">{props.children}</h2>;
};

Section.Title = SectionTitle;
