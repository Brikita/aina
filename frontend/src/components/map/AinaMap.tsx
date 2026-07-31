import { useMemo, type ReactNode, type ComponentType } from "react";
import {
  CircleMarker,
  GeoJSON,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import type { GeoJSONProps } from "react-leaflet/GeoJSON";
import type { MapContainerProps } from "react-leaflet/MapContainer";
import type { MarkerProps } from "react-leaflet/Marker";
import type { PopupProps } from "react-leaflet/Popup";
import type { TileLayerProps } from "react-leaflet/TileLayer";
import { useAppContext } from "../../context/AppContext";
import { MOCK_HAZARD_DATA } from "../../data/mockHazards";
import type { RegionData } from "../../types";
import "leaflet/dist/leaflet.css";

interface LeafletMapContainerProps {
  center: [number, number];
  zoom: number;
  className?: string;
  children?: ReactNode;
}

interface LeafletTileLayerProps {
  url: string;
  attribution: string;
}

interface LeafletGeoJsonProps {
  data: object;
  style: () => {
    color: string;
    weight: number;
    fillColor: string;
    fillOpacity: number;
  };
  eventHandlers: { click: () => void };
}

interface LeafletMarkerProps {
  position: [number, number];
  children?: ReactNode;
}

interface LeafletPopupProps {
  children?: ReactNode;
}

const LeafletMapContainer = MapContainer as unknown as ComponentType<
  LeafletMapContainerProps & MapContainerProps
>;
const LeafletTileLayer = TileLayer as unknown as ComponentType<
  LeafletTileLayerProps & TileLayerProps
>;
const LeafletGeoJSON = GeoJSON as unknown as ComponentType<
  LeafletGeoJsonProps & GeoJSONProps
>;
const LeafletMarker = Marker as unknown as ComponentType<
  LeafletMarkerProps & MarkerProps
>;
const LeafletPopup = Popup as unknown as ComponentType<
  LeafletPopupProps & PopupProps
>;

const center: [number, number] = [1.2921, 36.8219];

const baseRegion: RegionData = {
  id: "kajiado-county",
  name: "Kajiado",
  hazardType: "Flood",
  severity: "High",
  context:
    "County flood watch intersects low-lying drainage and settlement corridors.",
};

const kajiadoPolygon = {
  type: "Feature",
  properties: {
    id: baseRegion.id,
    name: baseRegion.name,
    hazardType: baseRegion.hazardType,
    severity: baseRegion.severity,
    context: baseRegion.context,
  },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [36.35, -1.95],
        [36.82, -1.98],
        [36.98, -2.22],
        [36.58, -2.32],
        [36.35, -1.95],
      ],
    ],
  },
} as const;

export function AinaMap() {
  const { analyzeHazard } = useAppContext();

  const polygonStyle = useMemo(
    () => ({
      color: "#f59e0b",
      weight: 2,
      fillColor: "#fbbf24",
      fillOpacity: 0.25,
    }),
    [],
  );

  const hazardColor = (severity: string) => {
    if (severity === "Critical") return "#ef4444";
    if (severity === "High") return "#f97316";
    return "#facc15";
  };

  return (
    <section className="relative h-full min-h-0 overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-xl">
      <LeafletMapContainer center={center} zoom={6} className="h-full w-full">
        <LeafletTileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap &copy; CARTO"
        />

        <LeafletGeoJSON
          data={kajiadoPolygon}
          style={() => polygonStyle}
          eventHandlers={{ click: () => void analyzeHazard(baseRegion) }}
        />

        {Object.values(MOCK_HAZARD_DATA).map((location) => (
          <CircleMarker
            key={`hazard-${location.warning_id}`}
            center={[location.coordinates.lat, location.coordinates.lng]}
            radius={10}
            pathOptions={{
              color: hazardColor(location.severity),
              fillColor: hazardColor(location.severity),
              fillOpacity: 0.45,
            }}
            eventHandlers={{
              click: () => {
                void analyzeHazard(location);
              },
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
              {`${location.hazard} — ${location.county}`}
            </Tooltip>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{location.hazard}</p>
                <p>
                  {location.county}, {location.subcounty}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Severity: {location.severity}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Click to generate decision intelligence.
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        <LeafletMarker position={center}>
          <LeafletPopup>Nairobi operational hub</LeafletPopup>
        </LeafletMarker>
      </LeafletMapContainer>

      <div className="pointer-events-none absolute left-4 top-4 max-w-sm rounded-2xl bg-slate-950/70 px-4 py-3 text-sm text-slate-100 backdrop-blur-sm">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
          Map Intelligence
        </p>
        <p className="mt-1 text-slate-200">
          Click the highlighted county polygon to generate decision
          intelligence.
        </p>
      </div>
    </section>
  );
}
