"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { QrCode, MapPin, Trophy, Star, Gift, Camera, Navigation } from "lucide-react"
import QRScanner from "@/components/qr-scanner"
import NFTCollection from "@/components/nft-collection"
import LootBox from "@/components/loot-box"
import SuccessScreen from "@/components/success-screen"

interface ApiLandmark {
  id: number
  name: string
  description: string
  location: string
  lat: string
  lon: string
  created_at: string
  updated_at: string
}

interface Landmark {
  id: string
  name: string
  nameRu: string
  location: string
  description: string
  nftReward: string
  coordinates: { lat: number; lng: number }
  visited: boolean
}

const handleLootBoxOpen = async (landmarkId: string) => {
  try {
    // Call the NFT win endpoint
    const response = await fetch(`https://saint.kz/api/nfts/win/${landmarkId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    })

    if (response.ok) {
      const nftData = await response.json()
      return nftData
    } else {
      console.error('Failed to win NFT:', await response.text())
      return null
    }
  } catch (error) {
    console.error('Error calling NFT win endpoint:', error)
    return null
  }
}

export default function KazakhstanTourismApp() {
  const [currentView, setCurrentView] = useState<"home" | "scanner" | "collection" | "profile" | "success">("home")
  const [visitedLandmarks, setVisitedLandmarks] = useState<string[]>([])
  const [collectedNFTs, setCollectedNFTs] = useState<string[]>([])
  const [showLootBox, setShowLootBox] = useState(false)
  const [currentReward, setCurrentReward] = useState<string>("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [successNFTData, setSuccessNFTData] = useState<any>(null)
  const [locationStatus, setLocationStatus] = useState<"loading" | "granted" | "denied">("loading")
  const [landmarks, setLandmarks] = useState<Landmark[]>([])
  const [landmarksStatus, setLandmarksStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    const fetchLandmarks = async () => {
      setLandmarksStatus("loading")
      try {
        const response = await fetch('https://saint.kz/api/attractions')

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`)
        }

        const data: ApiLandmark[] = await response.json()

        // Transform API data to match our app's Landmark interface
        const transformedLandmarks: Landmark[] = data.map(item => ({
          id: item.id.toString(),
          name: item.name,
          nameRu: item.name, // Using the same name since nameRu is not in API
          location: item.location,
          description: item.description,
          nftReward: `NFT ${item.name}`, // Creating a default NFT reward name
          coordinates: {
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon)
          },
          visited: false
        }))

        setLandmarks(transformedLandmarks)
        setLandmarksStatus("success")
      } catch (error) {
        console.error('Failed to fetch landmarks:', error)
        // Fallback to empty array if fetch fails
        setLandmarks([])
        setLandmarksStatus("error")
      }
    }

    fetchLandmarks()
  }, [])

  const handleQRScan = async (data: string) => {
    const landmark = landmarks.find((l) => l.id === data)
    if (landmark) {
      if (!visitedLandmarks.includes(landmark.id)) {
        try {
          // Call the NFT win endpoint
          const response = await fetch(`https://saint.kz/api/nfts/win/${data}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            }
          })

          if (response.ok) {
            setVisitedLandmarks([...visitedLandmarks, landmark.id])
            setCurrentReward(landmark.nftReward)
            setShowLootBox(true)
          } else {
            console.error('Failed to win NFT:', await response.text())
          }
        } catch (error) {
          console.error('Error calling NFT win endpoint:', error)
        }
      }
    }
  }

  const handleScanSuccess = (nftData: any) => {
    // Format the NFT data for the success screen
    const formattedNFTData = {
      id: nftData.id || '',
      name: nftData.name || 'NFT Награда',
      description: nftData.description || 'Уникальная NFT награда за посещение достопримечательности Казахстана',
      rarity: nftData.rarity || 'Редкая',
      image: nftData.image || '🏆'
    }

    setSuccessNFTData(formattedNFTData)
    setCurrentView("success")
  }

  const handleGoHome = () => {
    setCurrentView("home")
    setSuccessNFTData(null)
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setLocationStatus("granted")
        },
        (error) => {
          console.log("[v0] Геолокация недоступна, используем демо координаты")
          setUserLocation({ lat: 48.0196, lng: 66.9237 })
          setLocationStatus("denied")
        },
      )
    } else {
      setUserLocation({ lat: 48.0196, lng: 66.9237 })
      setLocationStatus("denied")
    }
  }

  useEffect(() => {
    getUserLocation()
  }, [])

  if (currentView === "success" && successNFTData) {
    return <SuccessScreen nftData={successNFTData} onGoHome={handleGoHome} />
  }

  if (currentView === "scanner") {
    return <QRScanner onScan={handleQRScan} onBack={() => setCurrentView("home")} onSuccess={handleScanSuccess} />
  }

  if (currentView === "collection") {
    return <NFTCollection nfts={collectedNFTs} onBack={() => setCurrentView("home")} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">CityChess</h1>
            <p className="text-sm opacity-90">🇰🇿 Казахстан</p>
          </div>
          <div className="text-right">
            <div className="text-sm">NFT собрано</div>
            <div className="text-2xl font-bold">{collectedNFTs.length}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6 pb-24">
        {/* Progress */}
        <Card className="pulse-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-secondary" />
              Прогресс исследования
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Посещено достопримечательностей</span>
                <span>
                  {visitedLandmarks.length}/{landmarksStatus === "loading" ? "..." : landmarks.length}
                </span>
              </div>
              <Progress
                value={landmarksStatus === "loading"
                  ? 0
                  : landmarks.length > 0
                    ? (visitedLandmarks.length / landmarks.length) * 100
                    : 0
                }
                className={`h-2 ${landmarksStatus === "loading" ? "animate-pulse" : ""}`}
              />
              {landmarksStatus === "loading" && (
                <p className="text-xs text-muted-foreground">Загрузка данных...</p>
              )}
              {landmarksStatus === "error" && (
                <p className="text-xs text-red-500">Ошибка загрузки данных</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => setCurrentView("scanner")}
            className="h-20 flex-col gap-2 bg-primary hover:bg-primary/90"
          >
            <QrCode className="h-8 w-8" />
            <span>Сканировать QR</span>
          </Button>
          <Button onClick={() => setCurrentView("collection")} variant="secondary" className="h-20 flex-col gap-2">
            <Gift className="h-8 w-8" />
            <span>Моя коллекция</span>
          </Button>
        </div>

        {/* Nearby Landmarks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Достопримечательности рядом
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {landmarksStatus === "loading" && (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Загрузка достопримечательностей...</p>
              </div>
            )}

            {landmarksStatus === "error" && (
              <div className="text-center py-8 text-red-500">
                <p>Не удалось загрузить достопримечательности.</p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={async () => {
                    setLandmarksStatus("loading");
                    try {
                      const response = await fetch('https://saint.kz/api/attractions');

                      if (!response.ok) {
                        throw new Error(`API responded with status: ${response.status}`);
                      }

                      const data: ApiLandmark[] = await response.json();

                      // Transform API data to match our app's Landmark interface
                      const transformedLandmarks: Landmark[] = data.map(item => ({
                        id: item.id.toString(),
                        name: item.name,
                        nameRu: item.name, // Using the same name since nameRu is not in API
                        location: item.location,
                        description: item.description,
                        nftReward: `NFT ${item.name}`, // Creating a default NFT reward name
                        coordinates: {
                          lat: parseFloat(item.lat),
                          lng: parseFloat(item.lon)
                        },
                        visited: false
                      }));

                      setLandmarks(transformedLandmarks);
                      setLandmarksStatus("success");
                    } catch (error) {
                      console.error('Failed to fetch landmarks:', error);
                      setLandmarks([]);
                      setLandmarksStatus("error");
                    }
                  }}
                >
                  Попробовать снова
                </Button>
              </div>
            )}

            {landmarksStatus === "success" && landmarks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Нет доступных достопримечательностей</p>
              </div>
            )}

            {landmarksStatus === "success" && landmarks.map((landmark) => (
              <div key={landmark.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{landmark.nameRu}</h3>
                  <p className="text-sm text-muted-foreground">{landmark.location}</p>
                  <p className="text-xs text-muted-foreground mt-1">{landmark.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {visitedLandmarks.includes(landmark.id) ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Star className="h-3 w-3 mr-1" />
                      Посещено
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <Navigation className="h-3 w-3 mr-1" />
                      {userLocation
                        ? locationStatus === "denied"
                          ? "Демо режим"
                          : `${calculateDistance(userLocation, landmark.coordinates).toFixed(1)} км`
                        : "Определение..."}
                    </Badge>
                  )}
                  <div className="text-xs text-center">
                    <div className="text-muted-foreground">Награда:</div>
                    <div className="font-medium text-slate-700">{landmark.nftReward}</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{visitedLandmarks.length}</div>
              <div className="text-sm text-muted-foreground">Посещено</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-slate-700">{collectedNFTs.length}</div>
              <div className="text-sm text-muted-foreground">NFT собрано</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              {landmarksStatus === "loading" ? (
                <div className="text-2xl font-bold text-green-600 animate-pulse">...</div>
              ) : landmarksStatus === "error" ? (
                <div className="text-2xl font-bold text-red-500">--</div>
              ) : landmarks.length > 0 ? (
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((visitedLandmarks.length / landmarks.length) * 100)}%
                </div>
              ) : (
                <div className="text-2xl font-bold text-green-600">0%</div>
              )}
              <div className="text-sm text-muted-foreground">Завершено</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Loot Box Modal */}
      {showLootBox && visitedLandmarks.length > 0 && (
        <LootBox
          reward={currentReward}
          landmarkId={visitedLandmarks[visitedLandmarks.length - 1]}
          onOpen={handleLootBoxOpen}
          onClose={() => setShowLootBox(false)}
        />
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4">
        <div className="flex justify-around">
          <Button
            variant={currentView === "home" ? "default" : "ghost"}
            onClick={() => setCurrentView("home")}
            className="flex-col gap-1 h-auto py-2"
          >
            <MapPin className="h-5 w-5" />
            <span className="text-xs">Главная</span>
          </Button>
          <Button
            variant={currentView === "scanner" ? "default" : "ghost"}
            onClick={() => setCurrentView("scanner")}
            className="flex-col gap-1 h-auto py-2"
          >
            <Camera className="h-5 w-5" />
            <span className="text-xs">Сканер</span>
          </Button>
          <Button
            variant={currentView === "collection" ? "default" : "ghost"}
            onClick={() => setCurrentView("collection")}
            className="flex-col gap-1 h-auto py-2"
          >
            <Gift className="h-5 w-5" />
            <span className="text-xs">Коллекция</span>
          </Button>
          <Button
            variant={currentView === "profile" ? "default" : "ghost"}
            onClick={() => setCurrentView("profile")}
            className="flex-col gap-1 h-auto py-2"
          >
            <Trophy className="h-5 w-5" />
            <span className="text-xs">Профиль</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

const calculateDistance = (pos1: { lat: number; lng: number }, pos2: { lat: number; lng: number }) => {
  const R = 6371 // Радиус Земли в км
  const dLat = ((pos2.lat - pos1.lat) * Math.PI) / 180
  const dLon = ((pos2.lng - pos1.lng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((pos1.lat * Math.PI) / 180) *
      Math.cos((pos2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
