import ReactSlider from "react-slider";

interface CartoSliderProps {
  currentTimestamp: string;
  isLoading: boolean;
  timestamps: string[];
  dispatchAppState: any;
  appState: any;
}

export function CartoSlider(props: CartoSliderProps) {
  const { isLoading, timestamps, dispatchAppState, currentTimestamp } = props;
  const lastTimestampIndex = timestamps?.length > 0 ? timestamps.length - 1 : 0;

  const sliderOptions = isLoading
    ? {
        max: 1,
        defaultValue: 1,
      }
    : {
        max: lastTimestampIndex,
        defaultValue: lastTimestampIndex,
      };

  return (
    <section class="carto__slider--wrapper">
      <div class="carto__slider--heading">
        <h4>Changeset Animation</h4>
      </div>
      <div class="carto__slider">
        <div class="carto__slider--tools">
          <p>
            {currentTimestamp && new Date(currentTimestamp).toLocaleString()}
          </p>
        </div>
        <ReactSlider
          disabled={isLoading}
          className="carto--slider"
          markClassName="slider--mark"
          min={0}
          {...sliderOptions}
          thumbClassName="slider--thumb"
          trackClassName="slider--track"
          onChange={(value: number) => {
            dispatchAppState({
              type: "SET_CURRENT_TIMESTAMP",
              data: {
                currentTimestamp: timestamps[value],
              },
            });
          }}
        />
      </div>
    </section>
  );
}
