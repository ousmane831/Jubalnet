import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { apiService } from "../../services/api";

interface CrimeRegion {
  region: string;
  crimes: number;
  latitude: number;
  longitude: number;
}

export default function CrimeMap() {
  const [regions, setRegions] = useState<CrimeRegion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService
      .getCrimeByRegion()
      .then((data) => {
        setRegions(data);
      })
      .catch((err) => {
        console.error("Erreur chargement carte:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center">Chargement de la carte...</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 mt-6">
      {/* Carte à gauche */}
      <div className="flex-1 h-[600px] shadow-lg rounded-xl overflow-hidden">
        <MapContainer
          center={[14.6928, -17.4467]} // centre du Sénégal
          zoom={7}
          minZoom={6}
          maxBounds={[
            [12.0, -18.5], // sud-ouest
            [16.0, -11.5], // nord-est
          ]}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {regions.map((region, idx) => (
            <CircleMarker
              key={idx}
              center={[region.latitude, region.longitude]}
              radius={Math.min(20, region.crimes * 2)}
              color="red"
              fillColor="red"
              fillOpacity={0.6}
            >
              <Popup>
                <h3 className="font-bold">{region.region}</h3>
                <p>Crimes : {region.crimes}</p>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Tableau à droite */}
      <div className="flex-1 overflow-auto h-[600px] bg-white rounded-xl shadow-lg p-4">
        <h2 className="text-xl font-bold mb-4">Liste des régions</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Région</th>
              <th className="border px-4 py-2 text-left">Nombre de crimes</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((region, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{region.region}</td>
                <td className="border px-4 py-2">{region.crimes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
