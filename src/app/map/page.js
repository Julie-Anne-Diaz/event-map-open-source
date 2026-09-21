"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { getEvents } from "@/lib/api";
import { LocateFixed, MapPinned, Search } from "lucide-react";

function buildEventPopup(event) {
  const root = document.createElement("div");
  root.className = "event-popup";

  const kicker = document.createElement("div");
  kicker.className = "event-popup-kicker";
  kicker.textContent = event.visibility?.replace("_", " ") || "Event";

  const title = document.createElement("h3");
  title.className = "event-popup-title";
  title.textContent = event.title;

  const description = document.createElement("p");
  description.className = "event-popup-description";
  description.textContent = event.description || "No description provided.";

  const meta = document.createElement("div");
  meta.className = "event-popup-meta";

  const rows = [
    event.location_name,
    new Date(event.start_time).toLocaleString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
  ];

  rows.forEach((value) => {
    const row = document.createElement("div");
    row.className = "event-popup-meta-row";
    const dot = document.createElement("span");
    dot.className = "event-popup-dot";
    const text = document.createElement("span");
    text.textContent = value;
    row.append(dot, text);
    meta.appendChild(row);
  });

  root.append(kicker, title, description, meta);
  return root;
}

function buildLocationPopup(label) {
  const root = document.createElement("div");
  root.className = "event-popup";
  const kicker = document.createElement("div");
  kicker.className = "event-popup-kicker";
  kicker.textContent = "Location";
  const title = document.createElement("h3");
  title.className = "event-popup-title";
  title.textContent = label;
  root.append(kicker, title);
  return root;
}

export default function MapPage() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [
              "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      center: [-82.3248, 29.6516],
      zoom: 12,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    async function loadEvents() {
      try {
        setEvents(await getEvents());
      } catch (error) {
        console.error(error);
        setMessage("Failed to load events.");
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach(({ marker }) => marker.remove());
    markersRef.current = [];

    const validEvents = events.filter(
      (event) =>
        typeof event.latitude === "number" &&
        typeof event.longitude === "number" &&
        !Number.isNaN(event.latitude) &&
        !Number.isNaN(event.longitude)
    );

    validEvents.forEach((event) => {
      const start = new Date(event.start_time);
      const markerEl = document.createElement("button");
      markerEl.type = "button";
      markerEl.className = "event-marker";
      markerEl.setAttribute("aria-label", `Open ${event.title}`);

      const inner = document.createElement("span");
      inner.className = "event-marker-inner";

      const month = document.createElement("span");
      month.className = "event-marker-month";
      month.textContent = start.toLocaleDateString([], { month: "short" }).toUpperCase();

      const day = document.createElement("span");
      day.className = "event-marker-day";
      day.textContent = String(start.getDate());

      inner.append(month, day);
      markerEl.appendChild(inner);
      markerEl.addEventListener("click", () => setSelectedEventId(event.id));

      const popup = new maplibregl.Popup({ offset: 28, closeButton: false, className: "loop-popup" })
        .setDOMContent(buildEventPopup(event));

      const marker = new maplibregl.Marker({ element: markerEl, anchor: "bottom" })
        .setLngLat([event.longitude, event.latitude])
        .setPopup(popup)
        .addTo(mapRef.current);

      markersRef.current.push({ id: event.id, marker });
    });

    if (validEvents.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      validEvents.forEach((event) => bounds.extend([event.longitude, event.latitude]));
      mapRef.current.fitBounds(bounds, { padding: 80, maxZoom: 14 });
    }
  }, [events]);

  function focusEvent(event) {
    setSelectedEventId(event.id);
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center: [event.longitude, event.latitude],
      zoom: 14,
      essential: true,
    });

    const match = markersRef.current.find(({ id }) => id === event.id);
    const popup = match?.marker.getPopup();
    if (popup) popup.addTo(mapRef.current);
  }

  async function handleGeocodeSearch(e) {
    e.preventDefault();
    setMessage("");
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) throw new Error("Failed to geocode location.");

      const results = await response.json();
      if (!results.length) {
        setMessage("No location found.");
        return;
      }

      const firstResult = results[0];
      const lat = Number(firstResult.lat);
      const lon = Number(firstResult.lon);

      if (mapRef.current) {
        mapRef.current.flyTo({ center: [lon, lat], zoom: 14, essential: true });
        new maplibregl.Popup({ offset: 18, closeButton: false, className: "loop-popup" })
          .setLngLat([lon, lat])
          .setDOMContent(buildLocationPopup(firstResult.display_name))
          .addTo(mapRef.current);
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to search location.");
    }
  }

  function handleUseMyLocation() {
    setMessage("");

    if (!navigator.geolocation) {
      setMessage("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (!mapRef.current) return;

        mapRef.current.flyTo({ center: [longitude, latitude], zoom: 14, essential: true });

        const el = document.createElement("div");
        el.className = "location-marker";

        new maplibregl.Marker({ element: el })
          .setLngLat([longitude, latitude])
          .setPopup(
            new maplibregl.Popup({ offset: 18, closeButton: false, className: "loop-popup" })
              .setDOMContent(buildLocationPopup("You are here"))
          )
          .addTo(mapRef.current);
      },
      () => setMessage("Unable to retrieve your location.")
    );
  }

  return (
    <main className="min-h-screen px-4 pb-32 pt-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 animate-enter">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-violet-300">
            <MapPinned size={16} />
            See what's happening around you
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">Explore the map</h1>
          <p className="mt-2 text-slate-400">Every pin is a plan waiting to happen.</p>
        </div>

        <div className="mb-5 flex flex-col gap-3 md:flex-row">
          <form onSubmit={handleGeocodeSearch} className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search a neighborhood, venue, or address"
                className="field-dark pl-11"
              />
            </div>
            <button type="submit" className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-violet-300">Search</button>
          </form>

          <button onClick={handleUseMyLocation} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-cyan-400/25 hover:bg-cyan-400/10 hover:text-cyan-200">
            <LocateFixed size={17} />
            Use my location
          </button>
        </div>

        {message && <p className="mb-4 text-sm text-red-300">{message}</p>}
        {loading && <p className="mb-4 text-sm text-slate-500">Loading events...</p>}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_330px]">
          <div className="map-shell overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0e14] shadow-[0_24px_80px_rgba(0,0,0,0.36)]">
            <div ref={mapContainer} className="h-[72vh] w-full" />
          </div>

          <aside className="dark-panel h-[72vh] overflow-y-auto rounded-[2rem] p-4">
            <div className="sticky top-0 z-10 mb-3 bg-gradient-to-b from-[#111620] via-[#111620]/95 to-transparent pb-4 pt-1">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-300">Nearby</p>
              <h2 className="mt-1 text-xl font-black text-white">{events.length} events</h2>
            </div>

            {events.length === 0 ? (
              <p className="p-3 text-sm text-slate-500">No events found.</p>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => focusEvent(event)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selectedEventId === event.id
                        ? "border-violet-400/30 bg-violet-400/10 shadow-[0_12px_30px_rgba(77,45,180,0.14)]"
                        : "border-white/[0.07] bg-white/[0.035] hover:border-white/15 hover:bg-white/[0.055]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl border border-violet-400/15 bg-violet-400/10 px-2.5 py-2 text-center text-violet-300">
                        <div className="text-[9px] font-black uppercase">{new Date(event.start_time).toLocaleDateString([], { month: "short" })}</div>
                        <div className="text-lg font-black leading-none">{new Date(event.start_time).getDate()}</div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-white">{event.title}</h3>
                        <p className="mt-1 truncate text-xs text-slate-500">{event.location_name}</p>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{event.description || "No description provided."}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
