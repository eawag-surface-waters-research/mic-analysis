import React, { Component } from "react";
import CONFIG from "../config.json";
import "../App.css";

class Modal extends Component {
  state = {
    selected: "thermalbar",
  };
  setSelected = (selected) => {
    this.setState({ selected });
  };
  render() {
    var { selected } = this.state;
    var { data } = this.props;
    return (
      <React.Fragment>
        <h1>{data["name"]}</h1>
        <div className="horizontal-navigation">
          <div
            className={
              selected === "thermalbar" ? "nav-item active" : "nav-item"
            }
            onClick={() => this.setSelected("thermalbar")}
          >
            Thermal Bar
          </div>
          <div
            className={
              selected === "anomalies" ? "nav-item active" : "nav-item"
            }
            onClick={() => this.setSelected("anomalies")}
          >
            Anomalies
          </div>
          <div
            className={selected === "si" ? "nav-item active" : "nav-item"}
            onClick={() => this.setSelected("si")}
          >
            Benchmark
          </div>
        </div>
        <React.Fragment>
          {selected === "thermalbar" && (
            <React.Fragment>
              <div className="description">
                In dimictic lakes, thermal bars (black line) typically form
                during spring and autumn mixing phases when waters on either
                side of the Tmd mix. In temperate lakes the Tmd is ~4 °C and
                vertical mixing is induced by water-column instability when
                surface water reaches this threshold.
              </div>
              <div className="content"><img src={`${CONFIG.bucket}/thermal/6.gif`} alt="Thermal Bar" /></div>
            </React.Fragment>
          )}
          {selected === "anomalies" && (
            <React.Fragment>
              <div className="description">
                Winter mixing anomalies refer to temporary shifts toward
                monomictic-like behavior, years in which a dimictic lake behaves
                as if it were monomictic. Over the past two decades, such
                anomalies have become increasingly common.
              </div>
              <div className="content"><img src={`${CONFIG.bucket}/anomalies/6.png`} alt="Thermal Bar" /></div>
            </React.Fragment>
          )}
          {selected === "si" && (
            <React.Fragment>
              <div className="description">
                Typical seasonal mixing and stratification cycles for this lake.
                This is a baseline for assessing whether current thermal
                behavior falls within the expected range or signals a departure
                indicative of an emerging shift.
              </div>
              <div className="content"><img
                src={`${CONFIG.bucket}/susceptibility-index/6.png`}
                alt="Thermal Bar"
              /></div>
            </React.Fragment>
          )}
        </React.Fragment>
      </React.Fragment>
    );
  }
}

export default Modal;
