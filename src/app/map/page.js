"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { getEvents } from "@/lib/api";

export default function MapPage() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");

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
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center: [-82.3248, 29.6516],
      zoom: 12,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
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

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const validEvents = events.filter(
      (event) =>
        typeof event.latitude === "number" &&
        typeof event.longitude === "number" &&
        !Number.isNaN(event.latitude) &&
        !Number.isNaN(event.longitude)
    );

    validEvents.forEach((event) => {
      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
        <div style="color: black;">
          <h3 style="font-weight: bold; margin-bottom: 8px;">${event.title}</h3>
          <p style="margin: 0 0 6px 0;">${event.description || "No description provided."}</p>
          <p style="margin: 0;"><strong>Location:</strong> ${event.location_name}</p>
          <p style="margin: 4px 0 0 0;"><strong>Starts:</strong> ${new Date(event.start_time).toLocaleString()}</p>
        </div>
      `);

      const marker = new maplibregl.Marker({ color: "#2563eb" })
        .setLngLat([event.longitude, event.latitude])
        .setPopup(popup)
        .addTo(mapRef.current);

      markersRef.current.push(marker);
    });

    if (validEvents.length > 0) {
      const bounds = new maplibregl.LngLatBounds();

      validEvents.forEach((event) => {
        bounds.extend([event.longitude, event.latitude]);
      });

      mapRef.current.fitBounds(bounds, {
        padding: 80,
        maxZoom: 14,
      });
    }
  }, [events]);

  async function handleGeocodeSearch(e) {
    e.preventDefault();
    setMessage("");

    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to geocode location.");
      }

      const results = await response.json();

      if (!results.length) {
        setMessage("No location found.");
        return;
      }

      const firstResult = results[0];
      const lat = Number(firstResult.lat);
      const lon = Number(firstResult.lon);

      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [lon, lat],
          zoom: 14,
          essential: true,
        });

        new maplibregl.Popup()
          .setLngLat([lon, lat])
          .setHTML(
            `<div style="color: black;"><strong>${firstResult.display_name}</strong></div>`
          )
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

        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 14,
            essential: true,
          });

          new maplibregl.Marker({ color: "#dc2626" })
            .setLngLat([longitude, latitude])
            .setPopup(
              new maplibregl.Popup().setHTML(
                `<div style="color: black;"><strong>Your Location</strong></div>`
              )
            )
            .addTo(mapRef.current);
        }
      },
      () => {
        setMessage("Unable to retrieve your location.");
      }
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Event Map</h1>

          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <form onSubmit={handleGeocodeSearch} className="flex gap-3 flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a place..."
                className="flex-1 border border-gray-300 rounded-lg p-3 text-black placeholder:text-gray-500 bg-white"
              />

              <button
                type="submit"
                className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Search
              </button>
            </form>

            <button
              onClick={handleUseMyLocation}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Use My Location
            </button>
          </div>

          {message && <p className="text-sm text-red-600">{message}</p>}
          {loading && <p className="text-sm text-gray-600">Loading events...</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div
              ref={mapContainer}
              className="w-full h-[70vh] rounded-xl overflow-hidden shadow-md border border-gray-200"
            />
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 h-[70vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Events</h2>

            {events.length === 0 ? (
              <p className="text-gray-600">No events found.</p>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => {
                      if (mapRef.current) {
                        mapRef.current.flyTo({
                          center: [event.longitude, event.latitude],
                          zoom: 14,
                          essential: true,
                        });
                      }
                    }}
                    className="w-full text-left bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-800">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {event.description || "No description provided."}
                    </p>
                    <p className="text-sm text-gray-700 mt-2">
                      <span className="font-medium">Location:</span> {event.location_name}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Starts:</span>{" "}
                      {new Date(event.start_time).toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}