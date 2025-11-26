import React, { Component, createRef } from "react";
import axios from "axios";
import L from "leaflet";
import "./css/leaflet.css";
import "../../App.css";
import CONFIG from "../../config.json";
import Modal from "../../components/modal";
import eawag_logo from "../../img/eawag.png";
import esa_logo from "../../img/esa.png";
import lakescci_logo from "../../img/lakescci.png";
import expand_logo from "../../img/expand.png";
import mixing_icon from "../../img/icon.png";
import lakes_img from "../../img/satellitelakes.png";
import shrink_logo from "../../img/shrink.png";
import calamiel from "../../img/calamiel.jpg";
import odermada from "../../img/odermada.jpg";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      lakes: [],
      mapFull: false,
    };

    this.targetRef = createRef();
  }

  handleScroll = () => {
    if (this.targetRef.current) {
      const scrollTo =
        this.targetRef.current.getBoundingClientRect().top +
        window.pageYOffset -
        80;
      window.scrollTo({
        top: scrollTo,
        behavior: "smooth",
      });
    }
  };

  toggleMap = () => {
    this.setState({ mapFull: !this.state.mapFull }, () =>
      window.dispatchEvent(new Event("resize"))
    );
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
      center: [55, -34],
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
    var { modal, lakes, mapFull } = this.state;
    const mix = lakes.filter((x) => x.properties.shifts > 0);
    var data = {};
    if (modal) {
      data = lakes.find((x) => x.properties.id == modal).properties;
    }
    document.title = "MixCI Analysis";
    return (
      <React.Fragment>
        <div className="main">
          <div className="header">
            <div className="inner">
              <div className="name">MixCI Analysis</div>
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
          </div>
          <div className="introduction">
            <div className="inner">
              <h1>
                Global Remote Sensing of Stratification and Mixing in Dimictic
                Lakes
              </h1>
              <div className="subtitle">
                <div className="number">{513}</div>{" "}
                <div className="label">
                  global dimictic <br />
                  lakes analysed.
                </div>
              </div>
              <div className="subtitle">
                <div className="number">{21}</div>{" "}
                <div className="label">
                  lakes with mixing <br /> anomolies (2000-2022).
                </div>
              </div>
              {/*<button>Paper</button>
              <button>Dataset</button>*/}
              <button onClick={this.handleScroll}>Learn more</button>
            </div>

            <div className="inner">
              <img src={lakes_img} alt="Satellite Lakes" />
            </div>
          </div>
          <div className="section-title">Explore Analysed Lakes</div>
          <div className={mapFull ? "map full" : "map"}>
            <div className="expand" onClick={this.toggleMap}>
              <img
                src={mapFull ? shrink_logo : expand_logo}
                alt={mapFull ? "Shrink" : "Expand"}
              />
            </div>
            <div id="map" />
            <div className="legend"><img src={mixing_icon} alt="Mixing Icon" /> Lakes with Mixing Anamolies</div>
          </div>
          <div className="section-title">Lakes with Mixing Anomalies</div>
          <div className="lakes">
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
                    <div className="years">{x.properties.years.join(", ")}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="section-title">About MixCI Analysis</div>
          <div className="text" ref={this.targetRef}>
            <p>
              Lakes around the world are changing as the climate warms—but how
              can we detect early warning signs of these shifts?{" "}
            </p>
            <p>
              In this study, we use satellite Earth Observation (EO) data to
              monitor lake surface temperatures and uncover clues about what’s
              happening beneath the surface. These surface patterns reveal when
              a lake is mixing (when water layers blend from top to bottom) or
              stratifying (when warmer water stays on top and colder water
              settles below). From this, we can classify each lake’s typical
              seasonal behavior—its mixing regime.{" "}
            </p>
            <h2>Spotting Lake Mixing Anomalies</h2>
            <p>
              This portal focuses on dimictic lakes, lakes that typically mix
              twice a year (in spring and autumn), stratify in summer, and
              exhibit inverse stratification (coldest water on top, densest near
              4 °C at the bottom) in winter.{" "}
            </p>

            <p>
              We apply a method known as thermal front tracking to identify
              thermal bars, narrow zones where near-maximum-density water
              (~4 °C) sinks, forming boundaries between colder nearshore and
              warmer offshore waters. While thermal front tracking has been used
              in lake studies before, we introduce a novel application of this
              method at global scale to detect key phases in the seasonal mixing
              cycle.
            </p>

            <p>
              To support this, we developed Mixing Cycle identification (MixCI), a
              framework that uses surface temperature patterns to detect the
              presence, timing, and recurrence of thermal bars. This provides a
              remote-sensing proxy for monitoring stratification and mixing
              events across dimictic lakes worldwide.{" "}
            </p>

            <p>
              Most importantly, MixCI allows us to detect winter mixing anomalies,
              instances where lakes deviate from their expected inverse
              stratification and behave as monomictic. These anomalies may be
              early indicators of regime shifts linked to climate change.{" "}
            </p>

            <p>
              By identifying such changes now, we gain valuable insight into
              which lakes are most vulnerable, helping us anticipate and respond
              to long-term shifts in lake behavior.{" "}
            </p>

            {/*<p>
              More details about the method and findings can be found in our XXX
              publication, and the underlying dataset used in this portal is
              available at XXX.
            </p>*/}
            <h2>People</h2>
            <div className="person">
              <img src={calamiel} alt="Elisa Calamita" />
              <div className="name">Dr. Elisa Calamita</div>
              <div className="title">Postdoctoral Research Associate</div>
              <div className="university">University of Tuebingen</div>
              <div className="email">
                <a href="mailto:elisa.calamita@uni-tuebingen.de">
                  elisa.calamita@uni-tuebingen.de
                </a>
              </div>
            </div>
            <div className="person">
              <img src={odermada} alt="Daniel Odermatt" />
              <div className="name">Dr. Daniel Odermatt</div>
              <div className="title">Group Leader</div>
              <div className="university">Eawag</div>
              <div className="email">
                <a href="mailto:daniel.odermatt@eawag.ch">
                  daniel.odermatt@eawag.ch
                </a>
              </div>
            </div>
          </div>
          <div className="footer">
            v0.1 | Copyright © 2025 MixCI Analyis | Website developed @ Eawag
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
