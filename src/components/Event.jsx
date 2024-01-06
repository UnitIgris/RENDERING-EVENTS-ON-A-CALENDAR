const Event = ({ event, windowWidth, windowHeight }) => {
  const {
    id,
    start,
    startValueInMinutes,
    duration,
    groupEventSize,
    calendarSlot,
  } = event;
  const r = Math.floor(Math.random() * 170);
  const g = Math.floor(Math.random() * 170);
  const b = Math.floor(Math.random() * 170);

  const windowTopPositionInMinutes = 0 * 60;
  const windowEndPositionInMinutes = 24 * 60;
  const ratio = windowHeight / windowEndPositionInMinutes;

  const top = (startValueInMinutes - windowTopPositionInMinutes) * ratio;
  const height = duration * ratio;
  const width = windowWidth / groupEventSize;
  const left = width * calendarSlot;

  const style = {
    display: "flex",
    position: "absolute",
    fontSize: "1.3vw",
    top: `${top}px`,
    left: `${left}px`,
    height: `${height}px`,
    width: width ? `${width}px` : "100%",
    background: `rgb(${r}, ${g}, ${b})`,
   
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  };

  return (
    <div style={style}>
      Event {id} starts at {start} for {duration} min
    </div>
  );
};

export default Event;
