import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Popup, useMap, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
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
  CartesianGrid,
} from "recharts";
import { CrimeReport } from "../../types";
import { 
  MapPin, 
  Filter, 
  BarChart3, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Sparkles,
  Activity
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

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

export const MapAndCharts: React.FC<MapAndChartsProps> = ({ reports }) => {
  const { language } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Liste des régions uniques
  const regions = Array.from(new Set(reports.map((r) => r.region))).sort();

  // Filtrage
  const filteredReports = reports.filter((r) => {
    const matchesRegion = selectedRegion === "all" || r.region === selectedRegion;
    const matchesStatus = selectedStatus === "all" || r.status === selectedStatus;
    return matchesRegion && matchesStatus;
  });

  // Données pour diagramme par statut
  const statusData = [
    {
      name: language === "fr" ? "Soumis" : "Yónnee",
      key: "submitted",
      value: filteredReports.filter((r) => r.status === "submitted").length,
    },
    {
      name: language === "fr" ? "En enquête" : "Ci wut",
      key: "investigating",
      value: filteredReports.filter((r) => r.status === "investigating").length,
    },
    {
      name: language === "fr" ? "Résolu" : "Jaax",
      key: "resolved",
      value: filteredReports.filter((r) => r.status === "resolved").length,
    },
    {
      name: language === "fr" ? "Fermé" : "Tax",
      key: "closed",
      value: filteredReports.filter((r) => r.status === "closed").length,
    },
  ];

  // Données pour diagramme par région (non filtré pour vue globale)
  const regionData = regions.map((region) => ({
    region,
    count: reports.filter((r) => r.region === region).length,
  })).sort((a, b) => b.count - a.count);

  const COLORS: Record<string, string> = {
    submitted: "#3B82F6", // bleu
    investigating: "#F97316", // orange
    resolved: "#10B981", // vert
    closed: "#6B7280", // gris
  };

  // Total pour afficher au centre du donut
  const total = statusData.reduce((acc, cur) => acc + cur.value, 0);
  const totalReports = reports.length;

  // Obtenir la couleur selon le statut pour les marqueurs
  const getStatusColor = (status: string) => {
    return COLORS[status] || "#6B7280";
  };

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-700 rounded-2xl shadow-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <BarChart3 className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1">
                {language === "fr" ? "Carte & Statistiques" : "Kart ak Statistiques"}
              </h2>
              <p className="text-indigo-100">
                {language === "fr"
                  ? `${totalReports} signalements au total • ${filteredReports.length} affichés`
                  : `${totalReports} baxal ci total • ${filteredReports.length} wone`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span className="font-bold text-2xl">{filteredReports.length}</span>
              </div>
              <p className="text-sm text-indigo-100 mt-1">
                {language === "fr" ? "Signalements filtrés" : "Baxal yu filtré"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-900">
            {language === "fr" ? "Filtres" : "Filtres"}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white cursor-pointer font-medium"
            >
              <option value="all">
                {language === "fr" ? "Toutes les régions" : "Réegion yépp"}
              </option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white cursor-pointer font-medium"
            >
              <option value="all">
                {language === "fr" ? "Tous les statuts" : "Statut yépp"}
              </option>
              <option value="submitted">
                {language === "fr" ? "Soumis" : "Yónnee"}
              </option>
              <option value="investigating">
                {language === "fr" ? "En enquête" : "Ci wut"}
              </option>
              <option value="resolved">
                {language === "fr" ? "Résolu" : "Jaax"}
              </option>
              <option value="closed">
                {language === "fr" ? "Fermé" : "Tax"}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Carte + Diagramme par statut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carte */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {language === "fr" ? "Carte des signalements" : "Kart baxal yi"}
              </h3>
            </div>
          </div>
          <div className="h-[500px]">
            <MapContainer
              center={[14.5, -14.5]}
              zoom={6}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {filteredReports.map(
                (report) =>
                  report.latitude &&
                  report.longitude && (
                    <CircleMarker
                      key={report.id}
                      center={[report.latitude, report.longitude]}
                      radius={8}
                      pathOptions={{
                        color: getStatusColor(report.status),
                        fillColor: getStatusColor(report.status),
                        fillOpacity: 0.7,
                        weight: 2,
                      }}
                    >
                      <Popup className="custom-popup">
                        <div className="p-3 min-w-[200px]">
                          <h4 className="font-bold text-gray-900 mb-2">{report.title}</h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {report.description}
                          </p>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{report.region}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getStatusColor(report.status) }}
                              ></div>
                              <span className="text-sm text-gray-700">{report.status}</span>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  )
              )}
              <FitBounds reports={filteredReports} />
            </MapContainer>
          </div>
        </div>

        {/* Diagramme Statut */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 relative">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {language === "fr" ? "Répartition par statut" : "Répartition ci statut"}
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={statusData.filter((d) => d.value > 0)}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value, percent }) =>
                  `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
                labelLine={false}
              >
                {statusData
                  .filter((d) => d.value > 0)
                  .map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.key] || "#ccc"}
                    />
                  ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [
                  `${value} ${language === "fr" ? "signalements" : "baxal"}`,
                  language === "fr" ? "Quantité" : "Baxal",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Total au centre */}
          {total > 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <span className="text-4xl font-bold text-gray-900">{total}</span>
                <p className="text-sm text-gray-600 mt-1">
                  {language === "fr" ? "Total" : "Total"}
                </p>
              </div>
            </div>
          )}

          {/* Légende */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {statusData
              .filter((d) => d.value > 0)
              .map((entry) => (
                <div key={entry.key} className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[entry.key] }}
                  ></div>
                  <span className="text-sm text-gray-700">{entry.name}</span>
                  <span className="text-sm font-bold text-gray-900">{entry.value}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Diagramme par Région */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            {language === "fr"
              ? "Répartition des signalements par région"
              : "Répartition baxal yi ci réegion"}
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={regionData.slice(0, 10)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="region"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: any) => [
                `${value} ${language === "fr" ? "signalements" : "baxal"}`,
                language === "fr" ? "Quantité" : "Baxal",
              ]}
              labelStyle={{ color: "#374151" }}
            />
            <Bar
              dataKey="count"
              fill="#3B82F6"
              radius={[8, 8, 0, 0]}
              label={{ position: "top", fontSize: 12 }}
            >
              {regionData.slice(0, 10).map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(${210 + index * 10}, 70%, 50%)`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
