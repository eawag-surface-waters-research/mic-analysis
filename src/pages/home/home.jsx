import React, { Component, createRef } from "react";
import axios from "axios";
import L from "leaflet";
import "./css/leaflet.css";
import "../../App.css";
import CONFIG from "../../config.json";
import eawag_logo from "../../img/eawag.png";
import esa_logo from "../../img/esa.png";
import lakescci_logo from "../../img/lakescci.png";
import Modal from "../../components/modal";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      lakes: [],
    };

    this.targetRef = createRef();
  }

  handleScroll = () => {
    if (this.targetRef.current) {
      const offsetTop =
        this.targetRef.current.getBoundingClientRect().top + window.pageYOffset;
      const scrollTo = offsetTop - 50;
      window.scrollTo({
        top: scrollTo,
        behavior: "smooth",
      });
    }
  };

  closeModal = (event, force = false) => {
    if (
      !document.getElementById("modal-inner").contains(event.target) ||
      force
    ) {
      this.setState({ modal: false });
    }
  };

  setModal = (modal) => {
    this.setState({ modal });
  };

  plotLakes = (lakes) => {
    const lakeIcon = L.icon({
      iconUrl: `${process.env.PUBLIC_URL}/lake-marker.png`,
      iconSize: [25, 27],
      iconAnchor: [15, 32],
      tooltipAnchor: [0, -32],
      className: "lake-icon",
    });
    const mixIcon = L.icon({
      iconUrl: `${process.env.PUBLIC_URL}/mix-marker.png`,
      iconSize: [40, 43],
      iconAnchor: [15, 32],
      tooltipAnchor: [0, -32],
      className: "mix-icon",
    });

    const lakesLayer = L.layerGroup().addTo(this.map);
    const mixLayer = L.layerGroup().addTo(this.map);

    lakes.features
      .filter((x) => x.properties.shifts == 0)
      .forEach((x) => {
        const marker = L.marker(
          [x.geometry.coordinates[1], x.geometry.coordinates[0]],
          { icon: lakeIcon, title: x.properties.name }
        );
        marker.on("click", () => {
          this.setState({ modal: x.properties.id });
        });
        lakesLayer.addLayer(marker);
      });

    lakes.features
      .filter((x) => x.properties.shifts > 0)
      .forEach((x) => {
        const marker = L.marker(
          [x.geometry.coordinates[1], x.geometry.coordinates[0]],
          { icon: mixIcon, title: x.properties.name }
        );
        marker.on("click", () => {
          this.setState({ modal: x.properties.id });
        });
        mixLayer.addLayer(marker);
      });

    mixLayer.eachLayer((layer) => layer.setZIndexOffset(1000));
  };

  async componentDidMount() {
    this.map = L.map("map", {
      preferCanvas: true,
      zoomControl: false,
      center: [55, -60],
      zoom: 3,
      minZoom: 3,
      maxZoom: 12,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
    window.setTimeout(async () => {
      const { data: lakes } = await axios
        .get(`${CONFIG.bucket}/list.json`)
        .catch((error) => {
          console.error(error);
        });
      this.plotLakes(lakes);
      this.setState({ lakes: lakes.features });
    }, 0);
  }
  render() {
    var { modal, lakes } = this.state;
    const mix = lakes.filter((x) => x.properties.shifts > 0);
    var data = {};
    if (modal) {
      data = lakes.find((x) => x.properties.id == modal).properties;
    }
    document.title = "MIC Analysis";
    return (
      <React.Fragment>
        <div className="main">
          <div className="header">
            <div className="name">
              MiC Analysis
              <div className="strap">
                Tracking lake mixing anomalies in dimictic lakes worldwide.
              </div>
            </div>
            <div className="logos">
              <img
                src={lakescci_logo}
                alt="Lakes CCI Logo"
                style={{ height: "58px" }}
              />
              <img src={esa_logo} alt="ESA Logo" style={{ height: "32px" }} />
              <img
                src={eawag_logo}
                alt="Eawag Logo"
                style={{ height: "28px" }}
              />
            </div>
          </div>
          <div className="intro"></div>
          <div className="map">
            <div id="map" />
            <div className="button" onClick={this.handleScroll}>
              Learn more
            </div>
          </div>
          <div className="lakes">
            <div className="title">Mixing Anomolies</div>
            <div className="flex">
              {mix.map((x) => (
                <div
                  className="box"
                  key={x.properties.id}
                  onClick={() => this.setModal(x.properties.id)}
                >
                  <img
                    src={`${CONFIG.bucket}/thumbnails/${x.properties.id}.png`}
                    alt={x.properties.name}
                  />
                  <div className="side">
                    <div className="name">{x.properties.name}</div>
                    <div className="label">Anomalous years:</div>
                    <div className="years">{x.properties.years.join(", ")}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lakes">
            <div className="title" ref={this.targetRef}>
              About
            </div>
            <div className="space"></div>
          </div>
        </div>

        {modal && (
          <div className="modal" onClick={this.closeModal}>
            <div className="modal-inner" id="modal-inner">
              <div
                className="close"
                onClick={(event) => this.closeModal(event, true)}
              >
                &#x2715;
              </div>
              <Modal data={data} />
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default Home;
