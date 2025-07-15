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
            Susceptibility Index
          </div>
        </div>
        <div className="content-inner">
          {selected === "thermalbar" && (
            <img src={`${CONFIG.bucket}/thermal/6.gif`} alt="Thermal Bar" />
          )}
          {selected === "anomalies" && (
            <img src={`${CONFIG.bucket}/anomalies/6.png`} alt="Thermal Bar" />
          )}
          {selected === "si" && (
            <img
              src={`${CONFIG.bucket}/susceptibility-index/6.png`}
              alt="Thermal Bar"
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Modal;
