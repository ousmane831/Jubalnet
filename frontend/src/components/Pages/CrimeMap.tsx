import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Popup, CircleMarker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { apiService } from "../../services/api";
import { 
  MapPin, 
  AlertTriangle, 
  TrendingUp, 
  BarChart3,
  Sparkles,
  Search,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

interface CrimeRegion {
  region: string;
  crimes: number;
  latitude: number;
  longitude: number;
}

// Composant pour ajuster automatiquement les bounds de la carte
const FitBounds: React.FC<{ regions: CrimeRegion[] }> = ({ regions }) => {
  const map = useMap();
  useEffect(() => {
    if (regions.length > 0) {
      const bounds: [number, number][] = regions.map((r) => [r.latitude, r.longitude] as [number, number]);
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [regions, map]);
  return null;
};

export default function CrimeMap() {
  const { language } = useLanguage();
  const [regions, setRegions] = useState<CrimeRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

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

  // Calculer le maximum pour normaliser les tailles
  const maxCrimes = Math.max(...regions.map(r => r.crimes), 1);
  const totalCrimes = regions.reduce((sum, r) => sum + r.crimes, 0);

  // Filtrer et trier les régions
  const filteredAndSortedRegions = [...regions]
    .filter((region) =>
      region.region.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.crimes - b.crimes;
      } else {
        return b.crimes - a.crimes;
      }
    });

  // Fonction pour obtenir la couleur selon le nombre de crimes
  const getColor = (crimes: number) => {
    const percentage = (crimes / maxCrimes) * 100;
    if (percentage >= 70) return "#ef4444"; // red
    if (percentage >= 40) return "#f97316"; // orange
    if (percentage >= 20) return "#eab308"; // yellow
    return "#22c55e"; // green
  };

  // Fonction pour obtenir la taille du marqueur
  const getRadius = (crimes: number) => {
    const minRadius = 8;
    const maxRadius = 40;
    const normalized = crimes / maxCrimes;
    return minRadius + (maxRadius - minRadius) * normalized;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            {language === 'fr' ? 'Chargement de la carte...' : 'Daje kart bi...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl shadow-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <MapPin className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1">
                {language === 'fr' ? 'Carte des crimes par région' : 'Kart njub yi ci réegion'}
              </h2>
              <p className="text-blue-100">
                {language === 'fr' 
                  ? `${totalCrimes} signalements répartis sur ${regions.length} régions`
                  : `${totalCrimes} baxal ci ${regions.length} réegion`
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span className="font-bold text-2xl">{totalCrimes}</span>
              </div>
              <p className="text-sm text-blue-100 mt-1">
                {language === 'fr' ? 'Total signalements' : 'Baxal yépp'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte - 2/3 de la largeur */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden h-[700px]">
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>{language === 'fr' ? 'Visualisation géographique' : 'Wone géographique'}</span>
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>{language === 'fr' ? 'Faible' : 'Ndaw'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>{language === 'fr' ? 'Moyen' : 'Diggu'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>{language === 'fr' ? 'Élevé' : 'Gën'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <MapContainer
              center={[14.6928, -17.4467]}
              zoom={7}
              minZoom={6}
              maxBounds={[
                [12.0, -18.5],
                [16.0, -11.5],
              ]}
              className="w-full h-full z-0"
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {regions.map((region, idx) => {
                const color = getColor(region.crimes);
                const radius = getRadius(region.crimes);
                const percentage = ((region.crimes / maxCrimes) * 100).toFixed(0);
                const isSelected = selectedRegion === region.region;
                
                return (
                  <CircleMarker
                    key={idx}
                    center={[region.latitude, region.longitude]}
                    radius={radius}
                    pathOptions={{
                      color: isSelected ? "#000000" : color,
                      fillColor: color,
                      fillOpacity: 0.7,
                      weight: isSelected ? 4 : 2,
                    }}
                    eventHandlers={{
                      click: () => setSelectedRegion(region.region),
                    }}
                  >
                    <Popup className="custom-popup">
                      <div className="p-3 min-w-[200px]">
                        <div className="flex items-center space-x-2 mb-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: color }}
                          ></div>
                          <h3 className="font-bold text-lg text-gray-900">{region.region}</h3>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                            <span className="text-sm font-semibold text-gray-700 flex items-center space-x-1">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <span>{language === 'fr' ? 'Signalements' : 'Baxal'}</span>
                            </span>
                            <span className="text-xl font-bold text-red-600">{region.crimes}</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                            <span className="text-sm font-semibold text-gray-700">
                              {language === 'fr' ? 'Pourcentage' : 'Pourcentage'}
                            </span>
                            <span className="text-lg font-bold text-blue-600">{percentage}%</span>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: color,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
              <FitBounds regions={regions} />
            </MapContainer>
          </div>
        </div>

        {/* Tableau des régions - 1/3 de la largeur */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 h-[700px] flex flex-col">
            {/* Header du tableau */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <span>{language === 'fr' ? 'Statistiques par région' : 'Statistiques ci réegion'}</span>
                </h3>
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title={language === 'fr' ? 'Trier' : 'Sori'}
                >
                  {sortOrder === "asc" ? (
                    <ArrowUp className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ArrowDown className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>
              
              {/* Barre de recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === 'fr' ? 'Rechercher une région...' : 'Wut réegion...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Liste des régions avec scroll */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredAndSortedRegions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>{language === 'fr' ? 'Aucune région trouvée' : 'Amul réegion'}</p>
                </div>
              ) : (
                filteredAndSortedRegions.map((region, idx) => {
                  const color = getColor(region.crimes);
                  const percentage = ((region.crimes / maxCrimes) * 100).toFixed(0);
                  const rank = filteredAndSortedRegions.findIndex(r => r.region === region.region) + 1;
                  const isSelected = selectedRegion === region.region;
                  
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedRegion(region.region)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-lg"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3 flex-1">
                          {/* Badge de rang */}
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            rank <= 3
                              ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}>
                            {rank}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 mb-1 truncate">{region.region}</h4>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full flex-shrink-0" 
                                style={{ backgroundColor: color }}
                              ></div>
                              <span className="text-2xl font-bold text-gray-900">{region.crimes}</span>
                              <span className="text-sm text-gray-500">
                                {language === 'fr' ? 'signalements' : 'baxal'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Icône de sélection */}
                        {isSelected && (
                          <div className="bg-blue-500 rounded-full p-1">
                            <MapPin className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      
                      {/* Barre de progression */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">
                            {language === 'fr' ? 'Proportion' : 'Proportion'}
                          </span>
                          <span className="text-xs font-semibold text-gray-700">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 rounded-full transition-all duration-500 relative"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: color,
                            }}
                          >
                            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer avec total */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  {language === 'fr' ? 'Total régions' : 'Réegion yépp'}
                </span>
                <span className="text-lg font-bold text-gray-900">{filteredAndSortedRegions.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
