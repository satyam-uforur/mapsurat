"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from "react-leaflet"
import { Icon } from "leaflet"
import { MapPin, Info, Menu, X, ChevronDown, ChevronUp, Search } from "lucide-react"
import "leaflet/dist/leaflet.css"

// Surat coordinates
const SURAT_CENTER = {
  latitude: 21.1702,
  longitude: 72.8311,
}

// Expanded price data for different areas
const AREA_PRICES = {
  Vesu: { min: 45000, max: 65000, premium: true },
  Adajan: { min: 50000, max: 70000, premium: true },
  Citylight: { min: 55000, max: 75000, premium: true },
  Piplod: { min: 48000, max: 68000, premium: true },
  Athwa: { min: 52000, max: 72000, premium: true },
  Katargam: { min: 40000, max: 60000, premium: false },
  Varachha: { min: 42000, max: 62000, premium: false },
  Dumas: { min: 35000, max: 55000, premium: false },
  Althan: { min: 38000, max: 58000, premium: false },
  Pal: { min: 36000, max: 56000, premium: false },
  Bhatar: { min: 44000, max: 64000, premium: false },
  "Majura Gate": { min: 47000, max: 67000, premium: false },
  Udhna: { min: 35000, max: 55000, premium: false },
  Pandesara: { min: 32000, max: 52000, premium: false },
  Sachin: { min: 30000, max: 50000, premium: false },
  Limbayat: { min: 28000, max: 45000, premium: false },
  Dindoli: { min: 25000, max: 42000, premium: false },
  Godadara: { min: 27000, max: 44000, premium: false },
  Bamroli: { min: 26000, max: 43000, premium: false },
  Kosad: { min: 24000, max: 40000, premium: false },
  Amroli: { min: 32000, max: 48000, premium: false },
  Uttran: { min: 30000, max: 46000, premium: false },
  Jahangirpura: { min: 28000, max: 45000, premium: false },
  Magdalla: { min: 33000, max: 50000, premium: false },
  Rander: { min: 35000, max: 52000, premium: false },
}

// Custom marker icons
const premiumIcon = new Icon({
  iconUrl: "https://unpkg.com/lucide-static/icons/map-pin.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  className: "premium-marker",
})

const standardIcon = new Icon({
  iconUrl: "https://unpkg.com/lucide-static/icons/map-pin.svg",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
  className: "standard-marker",
})

// Map center component
function SetViewOnSelect({ coords }: { coords: [number, number] | null }) {
  const map = useMap()

  useEffect(() => {
    if (coords) {
      map.setView(coords, 14)
    }
  }, [coords, map])

  return null
}

function App() {
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string
    latitude: number
    longitude: number
    price: { min: number; max: number; premium: boolean }
  } | null>(null)

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [legendOpen, setLegendOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
        setLegendOpen(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Expanded locations list with new areas
  const locations = [
    { name: "Vesu", latitude: 21.1555, longitude: 72.7707, price: AREA_PRICES["Vesu"] },
    { name: "Adajan", latitude: 21.1959, longitude: 72.7933, price: AREA_PRICES["Adajan"] },
    { name: "Citylight", latitude: 21.1697, longitude: 72.7868, price: AREA_PRICES["Citylight"] },
    { name: "Piplod", latitude: 21.1527, longitude: 72.7877, price: AREA_PRICES["Piplod"] },
    { name: "Athwa", latitude: 21.1812, longitude: 72.8079, price: AREA_PRICES["Athwa"] },
    { name: "Katargam", latitude: 21.2225, longitude: 72.8301, price: AREA_PRICES["Katargam"] },
    { name: "Varachha", latitude: 21.2049, longitude: 72.8476, price: AREA_PRICES["Varachha"] },
    { name: "Dumas", latitude: 21.0919, longitude: 72.7174, price: AREA_PRICES["Dumas"] },
    { name: "Althan", latitude: 21.1435, longitude: 72.7891, price: AREA_PRICES["Althan"] },
    { name: "Pal", latitude: 21.1789, longitude: 72.7654, price: AREA_PRICES["Pal"] },
    { name: "Bhatar", latitude: 21.1673, longitude: 72.8157, price: AREA_PRICES["Bhatar"] },
    { name: "Majura Gate", latitude: 21.1891, longitude: 72.8302, price: AREA_PRICES["Majura Gate"] },
    { name: "Udhna", latitude: 21.1702, longitude: 72.8411, price: AREA_PRICES["Udhna"] },
    { name: "Pandesara", latitude: 21.1502, longitude: 72.8401, price: AREA_PRICES["Pandesara"] },
    { name: "Sachin", latitude: 21.0989, longitude: 72.8822, price: AREA_PRICES["Sachin"] },
    { name: "Limbayat", latitude: 21.1644, longitude: 72.8584, price: AREA_PRICES["Limbayat"] },
    { name: "Dindoli", latitude: 21.147, longitude: 72.8659, price: AREA_PRICES["Dindoli"] },
    { name: "Godadara", latitude: 21.1333, longitude: 72.8584, price: AREA_PRICES["Godadara"] },
    { name: "Bamroli", latitude: 21.1505, longitude: 72.8147, price: AREA_PRICES["Bamroli"] },
    { name: "Kosad", latitude: 21.2305, longitude: 72.8248, price: AREA_PRICES["Kosad"] },
    { name: "Amroli", latitude: 21.2397, longitude: 72.8511, price: AREA_PRICES["Amroli"] },
    { name: "Uttran", latitude: 21.2305, longitude: 72.7827, price: AREA_PRICES["Uttran"] },
    { name: "Jahangirpura", latitude: 21.2157, longitude: 72.7909, price: AREA_PRICES["Jahangirpura"] },
    { name: "Magdalla", latitude: 21.1453, longitude: 72.7445, price: AREA_PRICES["Magdalla"] },
    { name: "Rander", latitude: 21.2089, longitude: 72.7973, price: AREA_PRICES["Rander"] },
  ]

  // Filter locations based on search
  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort locations by price (high to low)
  const sortedLocations = [...filteredLocations].sort((a, b) => b.price.max - a.price.max)

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            <div>
              <h1 className="text-2xl font-bold">Surat Land Valuation</h1>
              <p className="text-sm opacity-90 hidden md:block">Interactive property price map of Surat city</p>
            </div>
          </div>
          <button className="md:hidden p-2 rounded-full hover:bg-white/10" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div className="flex-1 relative">
        <MapContainer
          center={[SURAT_CENTER.latitude, SURAT_CENTER.longitude]}
          zoom={11.5}
          style={{ width: "100%", height: "100%" }}
          zoomControl={false}
          className="z-0"
        >
          <ZoomControl position="topright" />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {locations.map((location) => (
            <Marker
              key={location.name}
              position={[location.latitude, location.longitude]}
              icon={location.price.premium ? premiumIcon : standardIcon}
              eventHandlers={{
                click: () => setSelectedLocation(location),
              }}
            >
              {selectedLocation?.name === location.name && (
                <Popup className="custom-popup">
                  <div className="p-3">
                    <h3 className="font-bold text-lg text-indigo-700">{location.name}</h3>
                    <div className="my-2">
                      <p className="text-sm text-gray-600">Estimated Price Range (per sq. ft):</p>
                      <p className="font-semibold text-lg">
                        ₹{location.price.min.toLocaleString()} - ₹{location.price.max.toLocaleString()}
                      </p>
                    </div>
                    {location.price.premium && (
                      <div className="bg-amber-50 border border-amber-200 rounded p-2 mt-2 text-xs text-amber-700">
                        <span className="font-semibold">Premium Area</span> - High demand location with excellent
                        amenities
                      </div>
                    )}
                  </div>
                </Popup>
              )}
            </Marker>
          ))}

          {selectedLocation && <SetViewOnSelect coords={[selectedLocation.latitude, selectedLocation.longitude]} />}
        </MapContainer>

        {/* Areas Sidebar */}
        <div
          className={`absolute top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-10 
          ${sidebarOpen ? "w-72" : "w-0 -translate-x-full md:translate-x-0 md:w-12"}`}
        >
          {/* Sidebar toggle button (desktop) */}
          <button
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md hidden md:block"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>

          <div className="h-full flex flex-col overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-bold text-lg text-gray-800 mb-2">Areas in Surat</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search areas..."
                  className="w-full px-3 py-2 border rounded-lg pl-8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              <div className="space-y-1">
                {sortedLocations.map((location) => (
                  <button
                    key={location.name}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedLocation?.name === location.name ? "bg-indigo-100 text-indigo-700" : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setSelectedLocation(location)
                      if (isMobile) setSidebarOpen(false)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{location.name}</span>
                      {location.price.premium && (
                        <span className="bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded">Premium</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      ₹{location.price.min.toLocaleString()} - ₹{location.price.max.toLocaleString()}
                    </div>
                  </button>
                ))}

                {filteredLocations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No areas match your search</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div
          className={`absolute bottom-4 right-4 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
            legendOpen ? "max-h-96" : "max-h-12"
          }`}
        >
          <div
            className="flex items-center justify-between p-3 cursor-pointer bg-gray-50 border-b"
            onClick={() => setLegendOpen(!legendOpen)}
          >
            <div className="flex items-center gap-2">
              <Info size={18} className="text-indigo-600" />
              <h2 className="font-bold text-gray-800">Map Legend</h2>
            </div>
            {legendOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
              <p className="text-sm">Premium Areas</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <p className="text-sm">Standard Areas</p>
            </div>
            <div className="pt-2">
              <p className="text-sm font-medium">Price Range:</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">₹24,000</span>
                <div className="h-2 flex-1 mx-2 bg-gradient-to-r from-blue-300 to-indigo-600 rounded"></div>
                <span className="text-xs text-gray-500">₹75,000</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 pt-2">* Prices are per square foot and approximate</div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white text-xs py-2 px-4 text-center">
        <p>© {new Date().getFullYear()} Surat Land Valuation Map | Data updated: March 2025</p>
      </footer>
    </div>
  )
}

// Missing icons for the sidebar toggle
function ChevronLeft(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  const { size = 24, ...rest } = props
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRight(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  const { size = 24, ...rest } = props
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

export default App

