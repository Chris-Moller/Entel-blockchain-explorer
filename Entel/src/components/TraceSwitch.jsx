const TraceSwitch = ({ toggled, setToggled }) => {
  const toggleTraceHandler = (e) => {
    e.stopPropagation()
    if (toggled) {
      setToggled(false);
    } else {
      setToggled(true);
    }
  };

  return (
    <div onClick={toggleTraceHandler} className={toggled ? "trace-switch-toggled" : "trace-switch"}>
        
        <div className={toggled ? "slider-right" : "slider-left"} />
        {toggled ? <span className="on">ON</span> : <span className="off">Trace</span>}
        
    </div>
  );
};

export default TraceSwitch;
