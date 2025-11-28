import React, { Component } from "react";
import CONFIG from "../config.json";
import "../App.css";

class Modal extends Component {
  state = {
    selected: "thermalbar",
    thermalbar: null,
    anomalies: 2000,
    si: null,
  };
  setSelected = (selected) => {
    this.setState({ selected });
  };
  componentDidMount() {
    var { data } = this.props;
    this.setState({ thermalbar: data["years"][0], si: data["years"][0] });
  }
  render() {
    var { selected, thermalbar, anomalies, si } = this.state;
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
              {thermalbar && (<React.Fragment>
                <div className="modal-years">
                  Select year:
                  <select
                    value={thermalbar}
                    className="modal-select"
                    onChange={(e) => this.setState({ thermalbar: e.target.value })}
                  >
                    {data["years"].map((year) => (<option key={year} value={year}>{year}</option>))}
                  </select>
                </div>
                <div className="content">
                  <video
                    width="100%"
                    key={thermalbar}
                    autoPlay
                    muted
                    controls
                    preload="metadata"
                  >
                    <source
                      src={`${CONFIG.bucket}/plots/ID${data.id}/animations/ID${data.id}_animation_${thermalbar}.mp4`}
                      type="video/mp4"
                    />
                    Your browser doesn't support video playback.
                  </video>
                </div>
              </React.Fragment>)}
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
              {anomalies && (<React.Fragment>
                <div className="modal-years">
                  Select year:
                  <select
                    value={anomalies}
                    className="modal-select"
                    onChange={(e) => this.setState({ anomalies: e.target.value })}
                  >
                    {[...Array(23).keys()].map((i) => (<option key={i + 2000} value={i + 2000} className={data.years.includes(i + 2000) ? "highlight" : ""}>{i + 2000}</option>))}
                  </select>
                </div>
                <div className="content">
                  <img src={`${CONFIG.bucket}/plots/ID${data.id}/timeseries/ID${data.id}_timeseries_${anomalies}.png`} alt="Anomalies" />
                </div>
              </React.Fragment>)}
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
              {si && (<React.Fragment>
                <div className="modal-years">
                  Select year:
                  <select
                    value={si}
                    className="modal-select"
                    onChange={(e) => this.setState({ si: e.target.value })}
                  >
                    {data["years"].map((year) => (<option key={year} value={year}>{year}</option>))}
                  </select>
                </div>
                <div className="content">
                  <img
                    src={`${CONFIG.bucket}/plots/ID${data.id}/baseline/ID${data.id}_baseline_${si}.png`}
                    alt="Thermal Bar"
                  />
                </div>
              </React.Fragment>)}
            </React.Fragment>
          )}
        </React.Fragment>
      </React.Fragment>
    );
  }
}

export default Modal;
