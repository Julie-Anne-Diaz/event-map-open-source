"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { getEvents } from "@/lib/api";
import { LocateFixed, MapPinned, Search } from "lucide-react";

function popupKicker(event) {
  if (event.visibility === "invite_only") return "BY INVITE";
  if (event.visibility === "private") return "PRIVATE PLAN";
  return "HAPPENING HERE";
}

function buildEventPopup(event) {
  const root = document.createElement("div");
  root.className = "event-popup";

  const kicker = document.createElement("div");
  kicker.className = "event-popup-kicker";
  kicker.textContent = popupKicker(event);

  const title = document.createElement("h3");
  title.className = "event-popup-title";
  title.textContent = event.title;

  const description = document.createElement("p");
  description.className = "event-popup-description";
  description.textContent = event.description || "No description yet — the title will have to do the convincing.";

  const meta = document.createElement("div");
  meta.className = "event-popup-meta";

  const rows = [
    ["Where", event.location_name],
    ["When", new Date(event.start_time).toLocaleString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })],
  ];

  rows.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "event-popup-meta-row";
    const key = document.createElement("span");
    key.className = "event-popup-label";
    key.textContent = label;
    const text = document.createElement("span");
    text.textContent = value;
    row.append(key, text);
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
  kicker.textContent = "FOUND IT";
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

      const popup = new maplibregl.Popup({ offset: 28, closeButton: false, className: "vida-popup" })
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
    mapRef.current.flyTo({ center: [event.longitude, event.latitude], zoom: 14, essential: true });
    const match = markersRef.current.find(({ id }) => id === event.id);
    const popup = match?.marker.getPopup();
    if (popup) popup.addTo(mapRef.current);
  }

  async function handleGeocodeSearch(e) {
    e.preventDefault();
    setMessage("");
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
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
        new maplibregl.Popup({ offset: 18, closeButton: false, className: "vida-popup" })
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
            new maplibregl.Popup({ offset: 18, closeButton: false, className: "vida-popup" })
              .setDOMContent(buildLocationPopup("You are here"))
          )
          .addTo(mapRef.current);
      },
      () => setMessage("Unable to retrieve your location.")
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 pb-32 pt-9">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-violet-700"><MapPinned size={16} /> vidamobile map</div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">See what's nearby</h1>
          <p className="mt-2 text-zinc-500">Pins are plans. Click one and see if it's worth the trip.</p>
        </div>

        <div className="mb-5 flex flex-col gap-3 md:flex-row">
          <form onSubmit={handleGeocodeSearch} className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search a neighborhood, venue, or address" className="field-dark pl-11" />
            </div>
            <button type="submit" className="rounded-xl bg-[#242424] px-5 py-3 text-sm font-bold text-white transition hover:bg-black">Search</button>
          </form>

          <button onClick={handleUseMyLocation} className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100">
            <LocateFixed size={17} />
            Use my location
          </button>
        </div>

        {message && <p className="mb-4 text-sm text-red-700">{message}</p>}
        {loading && <p className="mb-4 text-sm text-zinc-500">Loading events...</p>}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_330px]">
          <div className="map-shell overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_12px_35px_rgba(24,24,27,0.08)]">
            <div ref={mapContainer} className="h-[72vh] w-full" />
          </div>

          <aside className="h-[72vh] overflow-y-auto rounded-2xl border border-zinc-200 bg-[#f7f7f8] p-4">
            <div className="sticky top-0 z-10 mb-3 bg-gradient-to-b from-[#f7f7f8] via-[#f7f7f8] to-transparent pb-4 pt-1">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-700">Nearby</p>
              <h2 className="mt-1 text-xl font-extrabold text-zinc-900">{events.length} events</h2>
            </div>

            {events.length === 0 ? (
              <p className="p-3 text-sm text-zinc-500">No events found.</p>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => focusEvent(event)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      selectedEventId === event.id
                        ? "border-violet-300 bg-violet-50"
                        : "border-zinc-200 bg-white hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-violet-100 px-2.5 py-2 text-center text-violet-700">
                        <div className="text-[9px] font-black uppercase">{new Date(event.start_time).toLocaleDateString([], { month: "short" })}</div>
                        <div className="text-lg font-black leading-none">{new Date(event.start_time).getDate()}</div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-zinc-900">{event.title}</h3>
                        <p className="mt-1 truncate text-xs text-zinc-500">{event.location_name}</p>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">{event.description || "No description provided."}</p>
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
