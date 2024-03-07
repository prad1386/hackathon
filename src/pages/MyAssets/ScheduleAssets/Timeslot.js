
const Timeslots = ({time, classstr, onClick, id}) => {

    return (
        <>
        <button
        className={classstr}
        key={Math.random()} id={Math.random()}
        onClick={onClick}
      >
        <span key={Math.random()} id={Math.random()}>
          {time.start_time} - {time.end_time}
        </span>
        <br />
        <span key={Math.random()} id={Math.random()}>
          {time.remaining_assets} of {time.max_assets}
        </span>
      </button>
</>
    )
   
}

export default Timeslots;