import { Component, h, Prop, State, Element, getAssetPath } from "@stencil/core"; // eslint-disable-line @typescript-eslint/no-unused-vars
import L, { LatLng, LatLngExpression, Marker } from "leaflet";
import { initComponent, getState } from "./communications";
import deleteProperty = Reflect.deleteProperty;

@Component({
  tag: "movin-things",
  styleUrl: "movin-things.css",
  shadow: true,
  assetsDirs: ["assets", "images"]
})
export class MovinThings {
  @Element() el: HTMLElement;
  @Prop() api: string;
  @Prop() config: string;
  @Prop() forcedlocale: string;
  tileLayers: Array<{ id: string; name: string; url: string }> = [];
  maxzoom = "19";
  minzoom = "11";
  initlayer = "geolandbasemap";
  msTimeout: number;
  attribution = "";
  geolocation: LatLngExpression = null;
  zoom = 13;
  title_attribute: string;
  private readonly _uninitialized_timeout_id = -1;
  timeoutID: number = this._uninitialized_timeout_id;
  @State() maparea: L.Map = null;
  @State() things: Array<{
    id: string;
    geolocation: number[];
    marker: Marker;
    labelmarker: Marker;
  }> = [
  ];
  @State() unknownicon = "unknown.svg";
  /*
   * Component members which don't require rerender thus no @State decorator
   */
  layergroupref: L.LayerGroup = null;
  labellayergroupref: L.LayerGroup = null;

  unknowniconurl=getAssetPath(`assets/icon/${this.unknownicon}`)

  unknownLeafletIcon = L.icon({
    iconUrl: this.unknowniconurl,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -8],
  });

  private showError(errorMessage: string): void {
    console.log("Error to show=", errorMessage);
  }

  private removeNotUpdatedDTOs = (dtoids: string[]): void => {
    const tobepreserved = this.things.filter((item) => {
      if (dtoids.indexOf(item.id) < 0) {
        item.marker.removeFrom(this.maparea);
        item.labelmarker.removeFrom(this.maparea);
      } else {
        return item;
      }
    });

    this.things = tobepreserved.concat();
  };

  private updateExistingDTOs = (
    dtos: [{ id: string; geolocation: number[] }]
  ): void => {
    const tobeadded = dtos.filter((dto) => {
      const { id, geolocation, ...rest } = dto;
      const index = this.things.findIndex((thing) => thing.id === id);
      if (index > -1) {
        // Exists in current so update coordinates
        this.things[index].marker.setLatLng(
          new LatLng(geolocation[0], geolocation[1])
        );
        this.things[index].labelmarker.setLatLng(
          new LatLng(geolocation[0], geolocation[1])
        );
        this.maintainPopup(
          rest,
          this.things[index].marker,
          this.title_attribute,
          this.things[index].labelmarker
        );
        this.things[index].geolocation = geolocation;
      } else {
        // New dto which should be added
        return dto;
      }
    });

    this.addNewDTOs([tobeadded]);
  };

  private maintainPopup(
    rest: {}, // eslint-disable-line @typescript-eslint/ban-types
    marker: Marker,
    title_attribute: string,
    labelmarker: Marker
  ): void {
    const dto = rest;
    let title = "";
    let title_attribute_value;
    if (title_attribute && dto[title_attribute]?.toString()) {
      if (dto["type"]) {
        title = dto["type"] + ": ";
      }
      title = title + dto[title_attribute];
      title_attribute_value = dto[title_attribute].toString();
      deleteProperty(dto, title_attribute);
      deleteProperty(dto, "type");
    }
    if (title_attribute_value) {
      const labeltext =
        `<div class="markerlabel">` + title_attribute_value + `</div>`;
      const updatedicon = L.divIcon({
        html: labeltext,
      });
      labelmarker.setIcon(updatedicon);
      title = "<strong>" + title + "</strong>";
    }
    const txt = title + this.text2Html(JSON.stringify(dto, undefined, 2));
    marker.getPopup().setContent(txt);
  }

  private text2Html(text): string {
    // 1: Plain Text Search
    let newtext = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/ +/g, " ")
      .replace(/["{}](\r\n?|\n)?/g, "");
    // 2: Line Breaks
    newtext = newtext.replace(/,?(\r\n?|\n)/g, "<br>");
    // 3: Paragraphs
    newtext = newtext.replace(/<br>\s*<br>/g, "</p><p>");
    // 4: Wrap in Paragraph Tags
    newtext = "<p>" + newtext + "</p>";
    return newtext;
  }

  private addNewDTOs = ([dtos]): void => {
    dtos.forEach((item) => {
      if (item) {
        const { id, geolocation, ...rest } = item; // eslint-disable-line @typescript-eslint/no-unused-vars

        const newmarker = L.marker(item.geolocation, {
          icon: this.unknownLeafletIcon,
        });
        const newlabelmarker = L.marker(item.geolocation, {
          icon: L.divIcon(),
        });
        const markerpopup = L.popup();
        this.things.push({
          id: item.id,
          geolocation: item.geolocation,
          marker: newmarker,
          labelmarker: newlabelmarker,
        });

        newlabelmarker.bindPopup(markerpopup).addTo(this.labellayergroupref);
        newmarker.bindPopup(markerpopup).addTo(this.layergroupref);
        this.maintainPopup(
          rest,
          newmarker,
          this.title_attribute,
          newlabelmarker
        );
      }
    });
  };

  private updateDTOs = (): void => {
    if (this.timeoutID != this._uninitialized_timeout_id) {
      clearTimeout(this.timeoutID);
    }
    const bb = this.maparea.getBounds();
    getState(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (senddata: [dataobject: any]) => {
        if (senddata?.length > 0) {
          const dtos = ([{ id: String }] = senddata); // eslint-disable-line no-global-assign
          this.removeNotUpdatedDTOs(dtos.map((dto) => dto.id));
          this.updateExistingDTOs(dtos);
        } else {
          this.removeNotUpdatedDTOs(senddata);
        }
        senddata = null;
        this.timeoutID = setTimeout(() => {
          this.updateDTOs();
        }, this.msTimeout);
      },
      this.showError,
      [
        [bb.getSouthWest().lat, bb.getSouthWest().lng],
        [bb.getNorthEast().lat, bb.getNorthEast().lng],
      ],
      this.config
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private setMapLayers = (configData: any): void => {
    if (this.maparea) {
      if (configData?.layers) {
        this.tileLayers = configData.layers;
        this.geolocation = new LatLng(
          configData.geolocation[0],
          configData.geolocation[1]
        );
        this.zoom = configData.zoom;
        this.title_attribute = configData.title_attribute;
        this.maxzoom = configData.maxzoom;
        this.minzoom = configData.minzoom;
        this.initlayer = configData.initlayer;
        this.attribution = configData.attribution;
        this.msTimeout = configData.ms_timeout ? configData.ms_timeout : 1000;
        const basemaps = this.getTileLayers();

        this.maparea.setView(this.geolocation, this.zoom);
        if (this.attribution.length > 0) {
          const attributioncontrol = this.maparea.attributionControl.addAttribution(
            this.attribution
          );
          attributioncontrol.setPrefix("");
        }
        this.maparea.addLayer(basemaps[0]);
        const branding = L.Control.extend({
          options: {
            position: "topright",
          },

          onAdd: function () {
            // create the control container with a particular class name
            // ** you can add the image to the div as a background image using css
            const container = L.DomUtil.create("div", "branding");
            return container;
          },
        });

        // DTO markers layer
        this.maparea.addControl(new branding());
        this.layergroupref = L.layerGroup([]);
        this.layergroupref.addTo(this.maparea);

        // Labels layer for DTO markers
        this.labellayergroupref = L.layerGroup([]);
        this.labellayergroupref.addTo(this.maparea);

        // Set default/visible maptilelayers
        const maptilelayers = {};
        for (const maplayer of basemaps) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const mapoptions: { name } = maplayer.options;
          if (mapoptions.name) {
            maptilelayers[mapoptions.name] = maplayer;
          }
        }

        const thingsdecorator = `Markers`;
        const labelsgroup = "Labels";
        const overlays = {
          [thingsdecorator]: this.layergroupref,
          [labelsgroup]: this.labellayergroupref,
        };
        L.control
          .layers(maptilelayers, overlays, { position: "bottomright" })
          .addTo(this.maparea);

        this.timeoutID = setTimeout(this.updateDTOs, 10);
      }
    }
  };

  async componentWillLoad(): Promise<void> {
    initComponent(
      this.setMapLayers,
      this.showError,
      this.config,
      this.api
    );
  }

  componentDidLoad(): void {
    if (this.maparea === null) {
      this.maparea = L.map(this.el.shadowRoot.getElementById("map"), {
        attributionControl: true,
        zoomControl: true,
      });
    }
  }

  private getTileLayers(): L.TileLayer.WMS[] {
    const basemaps = this.tileLayers.map(
      (layerconfig: { id: string; name: string; url: string }) => {
        return L.tileLayer.wms(layerconfig.url, {
          id: layerconfig.id,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          name: layerconfig.name,
        });
      }
    );
    return basemaps;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  render(): any {
    return (
      <div style={{ height: "100%" }}>
        <main style={{ height: "100%" }}>
          <div part="idmap" id="map"></div>
        </main>
      </div>
    );
  }
}
