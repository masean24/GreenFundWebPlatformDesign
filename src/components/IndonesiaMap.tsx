import L from "leaflet";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { formatRupiah, categoryLabels } from "../data/projects";

export const STATUS_CONFIG: Record<string, { color: string; label: string; pulse: boolean }> = {
  active:   { color: "#F59E0B", label: "Aktif",          pulse: true  },
  funded:   { color: "#4CAF50", label: "Terdanai",        pulse: false },
  pending:  { color: "#60A5FA", label: "Menunggu Review", pulse: false },
  revision: { color: "#F97316", label: "Perlu Revisi",    pulse: false },
};

export interface MapMarker {
  id: string;
  title: string;
  coordinates: [number, number]; // [longitude, latitude]
  status: "active" | "funded" | "pending" | "revision";
  raised?: number;
  goal?: number;
  backers?: number;
  category: "solar" | "wind" | "hydro" | "biogas" | "biomass";
  location: string;
}

function makeIcon(status: string, highlighted: boolean) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const dotSize = highlighted ? 16 : 12;
  const ringSize = dotSize + 16;

  if (cfg.pulse) {
    return L.divIcon({
      html: `
        <div class="gf-marker" style="width:${ringSize}px;height:${ringSize}px;">
          <div class="gf-marker-ring" style="width:${dotSize}px;height:${dotSize}px;background:${cfg.color};"></div>
          <div class="gf-marker-dot" style="width:${dotSize}px;height:${dotSize}px;background:${cfg.color};${highlighted ? "box-shadow:0 0 0 3px " + cfg.color + "40,0 1px 5px rgba(0,0,0,.3);" : ""}"></div>
        </div>`,
      className: "",
      iconSize: [ringSize, ringSize],
      iconAnchor: [ringSize / 2, ringSize / 2],
    });
  }

  return L.divIcon({
    html: `
      <div class="gf-marker" style="width:${dotSize + 4}px;height:${dotSize + 4}px;">
        <div class="gf-marker-dot" style="width:${dotSize}px;height:${dotSize}px;background:${cfg.color};${highlighted ? "box-shadow:0 0 0 3px " + cfg.color + "40,0 1px 5px rgba(0,0,0,.3);" : ""}"></div>
      </div>`,
    className: "",
    iconSize: [dotSize + 4, dotSize + 4],
    iconAnchor: [(dotSize + 4) / 2, (dotSize + 4) / 2],
  });
}

function TooltipContent({ marker }: { marker: MapMarker }) {
  const cfg = STATUS_CONFIG[marker.status];
  const pct = marker.raised !== undefined && marker.goal
    ? Math.min((marker.raised / marker.goal) * 100, 100)
    : null;

  return (
    <div style={{ minWidth: 180 }}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="w-2 h-2 rounded-full inline-block" style={{ background: cfg?.color }} />
        <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#9CA3AF" }}>
          {cfg?.label}
        </span>
      </div>
      <p className="font-semibold leading-snug mb-0.5" style={{ fontSize: 12, color: "#1E2A26" }}>
        {marker.title}
      </p>
      <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: pct !== null ? 8 : 0 }}>
        {marker.location}
      </p>
      {pct !== null && marker.raised !== undefined && marker.goal && (
        <>
          <div style={{ height: 5, borderRadius: 3, background: "#E5E8E4", overflow: "hidden", marginBottom: 4 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "#4CAF50", borderRadius: 3 }} />
          </div>
          <p style={{ fontSize: 10, color: "#6B7280" }}>
            {formatRupiah(marker.raised)}
            <span style={{ color: "#C4C9C2" }}> / {formatRupiah(marker.goal)}</span>
          </p>
        </>
      )}
      <p style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>
        {categoryLabels[marker.category]}
      </p>
    </div>
  );
}

interface IndonesiaMapProps {
  markers: MapMarker[];
  compact?: boolean;
  interactive?: boolean;
  onMarkerClick?: (id: string) => void;
  highlightedId?: string | null;
  height?: number;
}

export default function IndonesiaMap({
  markers,
  compact = false,
  interactive = false,
  onMarkerClick,
  highlightedId,
  height,
}: IndonesiaMapProps) {
  const mapHeight = height ?? (compact ? 300 : 480);

  return (
    <div style={{ height: mapHeight }} className="w-full relative">
      <MapContainer
        center={[-2.5, 118]}
        zoom={compact ? 4 : 5}
        style={{ height: "100%", width: "100%" }}
        zoomControl={!compact && interactive}
        dragging={!compact}
        scrollWheelZoom={!compact && interactive}
        doubleClickZoom={!compact && interactive}
        touchZoom={!compact}
        keyboard={interactive}
        attributionControl={false}
      >
        {/* CartoDB Positron — clean minimal tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={18}
        />

        {markers.map((marker) => {
          const isHL = highlightedId === marker.id;
          // Leaflet expects [lat, lng], our data is [lng, lat]
          const position: [number, number] = [marker.coordinates[1], marker.coordinates[0]];

          return (
            <Marker
              key={`${marker.id}-${isHL ? "hl" : "n"}`}
              position={position}
              icon={makeIcon(marker.status, isHL)}
              eventHandlers={
                onMarkerClick
                  ? { click: () => onMarkerClick(marker.id) }
                  : undefined
              }
            >
              {!compact && (
                <Tooltip
                  className="gf-tooltip"
                  direction="top"
                  offset={[0, -8]}
                  opacity={1}
                >
                  <TooltipContent marker={marker} />
                </Tooltip>
              )}
            </Marker>
          );
        })}
      </MapContainer>

      {/* Attribution overlay (compact hides it) */}
      {!compact && (
        <div className="absolute bottom-1.5 right-2 z-[400] text-[9px] text-[#9CA3AF] bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded">
          © OpenStreetMap · © CARTO
        </div>
      )}
    </div>
  );
}
