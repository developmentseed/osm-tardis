import ReactSlider from "react-slider";

interface PanelInputsProps {
  isLoading: boolean;
  timestamps: string[];
  dispatchAppState: any;
}

export function PanelInputs(props: PanelInputsProps) {
  const { isLoading, timestamps, dispatchAppState } = props;

  const lastTimestampIndex = timestamps?.length > 0 ? timestamps.length - 1 : 0;

  return (
    <article>
      <section>
        <h3>Area of Interest (AOI)</h3>
        <small>Zoom and pan the map to set the AOI for stats </small>
        <p>
          Currently selected: <strong>{2333}m&sup2;</strong>
        </p>
      </section>
      <section>
        <h3>Time Period</h3>
        <p>
          <small>Select one hour from: </small>
        </p>
        <input type="date" />
      </section>
      <section>
        {!isLoading && timestamps?.length > 0 && (
          <ReactSlider
            className="horizontal-slider"
            marks
            markClassName="example-mark"
            min={0}
            max={lastTimestampIndex}
            defaultValue={lastTimestampIndex}
            thumbClassName="example-thumb"
            trackClassName="example-track"
            renderThumb={(thumbProps: any) => <div {...thumbProps}>X</div>}
            disabled={isLoading}
            onChange={(value: number) => {
              dispatchAppState({
                type: "SET_CURRENT_TIMESTAMP",
                data: {
                  currentTimestamp: timestamps[value],
                },
              });
            }}
          />
        )}
      </section>
    </article>
  );
}
