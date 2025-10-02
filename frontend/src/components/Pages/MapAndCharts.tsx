import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from "react-leaflet";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Legend,
} from "recharts";
import { CrimeReport } from "../../types";

interface MapAndChartsProps {
  reports: CrimeReport[];
}

// Ajustement auto de la carte
const FitBounds: React.FC<{ reports: CrimeReport[] }> = ({ reports }) => {
  const map = useMap();
  useEffect(() => {
    if (reports.length > 0) {
      const bounds: [number, number][] = reports
        .filter((r) => r.latitude && r.longitude)
        .map((r) => [r.latitude!, r.longitude!] as [number, number]);
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [reports, map]);
  return null;
};

// Icônes personnalisées par statut
const statusIcons: Record<string, L.Icon> = {
  submitted: new L.Icon({
    iconUrl: "/blue-marker.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  investigating: new L.Icon({
    iconUrl: "/orange-marker.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  resolved: new L.Icon({
    iconUrl: "/green-marker.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
};

export const MapAndCharts: React.FC<MapAndChartsProps> = ({ reports }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  // Liste des régions uniques
  const regions = Array.from(new Set(reports.map((r) => r.region))).sort();

  // Filtrage
  const filteredReports =
    selectedRegion === "all"
      ? reports
      : reports.filter((r) => r.region === selectedRegion);

  // 📊 Données pour diagramme par statut
  const statusData = [
    {
      name: "Soumis",
      key: "submitted",
      value: filteredReports.filter((r) => r.status === "submitted").length,
    },
    {
      name: "En enquête",
      key: "investigating",
      value: filteredReports.filter((r) => r.status === "investigating").length,
    },
    {
      name: "Résolu",
      key: "resolved",
      value: filteredReports.filter((r) => r.status === "resolved").length,
    },
  ];

  // 📊 Données pour diagramme par région (non filtré)
  const regionData = regions.map((region) => ({
    region,
    count: reports.filter((r) => r.region === region).length,
  }));

  const COLORS: Record<string, string> = {
    submitted: "#3B82F6", // bleu
    investigating: "#F97316", // orange
    resolved: "#10B981", // vert
  };

  // Total pour afficher au centre du donut
  const total = statusData.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <div className="space-y-6">
      {/* Filtre Région */}
      <div className="bg-white rounded-xl shadow-lg p-4 flex items-center space-x-4">
        <label className="font-medium">🌍 Région :</label>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="all">Toutes les régions</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* Carte + Diagramme par statut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carte */}
<div className="bg-white rounded-xl shadow-lg p-4">
  <h3 className="text-lg font-semibold mb-3">🗺️ Carte des signalements</h3>
  <MapContainer
    center={[14.5, -14.5]}
    zoom={6}
    style={{ height: "400px", width: "100%" }}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="© OpenStreetMap contributors"
    />
    {filteredReports.map(
      (report) =>
        report.latitude &&
        report.longitude && (
          <CircleMarker
            key={report.id}
            center={[report.latitude, report.longitude]}
            radius={8} // taille du point
            color="red"
            fillColor="red"
            fillOpacity={0.8}
          >
            <Popup>
              <strong>{report.title}</strong>
              <br />
              {report.description}
              <br />
              📍 {report.region}
            </Popup>
          </CircleMarker>
        )
    )}
    <FitBounds reports={filteredReports} />
  </MapContainer>
</div>


        {/* Diagramme Statut */}
        <div className="bg-white rounded-xl shadow-lg p-4 relative">
          <h3 className="text-lg font-semibold mb-3">
            📊 Répartition par statut ({selectedRegion === "all" ? "toutes les régions" : selectedRegion})
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={70} // donut style
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.key] || "#ccc"}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Total au centre */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-gray-700">{total}</span>
          </div>
        </div>
      </div>

      {/* Diagramme par Région */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-3">
          🌍 Répartition des signalements par région
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={regionData}>
            <XAxis dataKey="region" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3B82F6" barSize={40} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
