"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, QrCode, Zap } from "lucide-react"

interface QRScannerProps {
  onScan: (data: string) => void
  onBack: () => void
  onSuccess: (nftData: any) => void
}

export default function QRScanner({ onScan, onBack, onSuccess }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [nftData, setNftData] = useState<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Демо QR коды для тестирования
  const demoQRCodes = [
    { id: "1", name: "Байтерек", location: "Астана" },
    { id: "3", name: "Медеу", location: "Алматы" },
    { id: "2", name: "Чарынский каньон", location: "Алматинская область" },
  ]

  const sendQRToBackend = async (qrData: string) => {
    setIsProcessing(true)
    try {
      // Use the new endpoint to win NFT
      const response = await fetch(`https://saint.kz/api/nfts/win/${qrData}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      })

      if (response.ok) {
        const result = await response.json()
        console.log("[v0] NFT успешно получен:", result)
        return result
      } else {
        console.error("[v0] Ошибка при получении NFT")
        // For testing purposes, return a mock NFT if the API call fails
        return {
          id: qrData,
          name: `NFT Достопримечательность ${qrData}`,
          description: "Тестовая NFT награда за посещение достопримечательности",
          rarity: "Редкая",
          image: "🏆"
        }
      }
    } catch (error) {
      console.error("[v0] Ошибка сети:", error)
      // For testing purposes, return a mock NFT if there's a network error
      return {
        id: qrData,
        name: `NFT Достопримечательность ${qrData}`,
        description: "Тестовая NFT награда за посещение достопримечательности",
        rarity: "Редкая",
        image: "🏆"
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const startScanning = async () => {
    setIsScanning(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Ошибка доступа к камере:", error)
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    setIsScanning(false)
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  const handleDemoScan = async (qrId: string) => {
    setScanResult(qrId)
    const nftData = await sendQRToBackend(qrId)
    if (nftData) {
      // Store the NFT data for use in the success modal
      setNftData(nftData)
    }
  }

  // Function to handle actual QR code scanning
  const scanQRCode = () => {
    if (!isScanning || !videoRef.current) return

    // This is a placeholder for actual QR code scanning logic
    // In a real implementation, you would use a library like jsQR to scan the video feed
    console.log("Scanning for QR codes...")

    // Simulate finding a QR code after a random delay (for testing)
    const timeout = setTimeout(() => {
      // Use one of the demo QR codes as a simulated scan result
      const randomIndex = Math.floor(Math.random() * demoQRCodes.length)
      const simulatedQRCode = demoQRCodes[randomIndex].id
      handleDemoScan(simulatedQRCode)

      // Stop scanning after finding a code
      stopScanning()
    }, 3000 + Math.random() * 2000)

    return () => clearTimeout(timeout)
  }

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(scanQRCode, 500)
      return () => clearInterval(interval)
    }
  }, [isScanning])

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/20">
        <Button variant="ghost" onClick={onBack} className="text-white">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Назад
        </Button>
        <h1 className="text-lg font-semibold">QR Сканер</h1>
        <div></div>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="relative w-full max-w-sm aspect-square mb-6">
          {isScanning ? (
            <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-white/30">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              {/* Scanning overlay */}
              <div className="absolute inset-0 border-2 border-primary rounded-2xl">
                <div className="absolute top-4 left-4 w-6 h-6 border-l-4 border-t-4 border-primary rounded-tl-lg"></div>
                <div className="absolute top-4 right-4 w-6 h-6 border-r-4 border-t-4 border-primary rounded-tr-lg"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-4 border-b-4 border-primary rounded-bl-lg"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-4 border-b-4 border-primary rounded-br-lg"></div>

                {/* Scanning line */}
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-primary shimmer"></div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full rounded-2xl border-4 border-dashed border-white/30 flex items-center justify-center">
              <QrCode className="h-20 w-20 text-white/50" />
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {isScanning ? "Наведите на QR код" : "Сканируйте QR код достопримечательности"}
          </h2>
          <p className="text-white/70">
            {isScanning
              ? "Убедитесь, что QR код четко виден в рамке"
              : "Нажмите кнопку ниже, чтобы начать сканирование"}
          </p>
        </div>

        {/* Scan Button */}
        {!isScanning && (
          <Button
            onClick={startScanning}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg pulse-glow"
          >
            <Zap className="h-5 w-5 mr-2" />
            Начать сканирование
          </Button>
        )}

        {isScanning && (
          <Button onClick={stopScanning} variant="secondary" className="px-8 py-3">
            Остановить
          </Button>
        )}

        {/* Demo QR Codes */}
        <div className="w-full max-w-sm mt-8">
          <h3 className="text-lg font-semibold mb-4 text-center">Демо QR коды для тестирования:</h3>
          <div className="space-y-3">
            {demoQRCodes.map((qr) => (
              <Card key={qr.id} className="bg-white/10 border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{qr.name}</h4>
                      <p className="text-sm text-white/70">{qr.location}</p>
                    </div>
                    <Button
                      onClick={() => handleDemoScan(qr.id)}
                      size="sm"
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    >
                      Сканировать
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Scan Result */}
        {scanResult && isProcessing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-white text-black bounce-in">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">⏳</div>
                <h3 className="text-lg font-semibold mb-2">QR код отсканирован!</h3>
                <p className="text-muted-foreground">Отправляем данные на сервер...</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Success Modal */}
        {scanResult && !isProcessing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-white text-black bounce-in max-w-sm w-full">
              <CardContent className="p-6 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-bold mb-2 text-green-600">Успех!</h3>
                <p className="text-muted-foreground mb-4">Вы успешно отсканировали QR код и получили NFT награду!</p>
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      // Use the NFT data from the API if available, otherwise use fallback
                      const nftToSend = nftData || {
                        id: scanResult,
                        name:
                          scanResult === "bayterek"
                            ? "Золотой Байтерек"
                            : scanResult === "medeu"
                              ? "Ледяная корона Медеу"
                              : "Дух каньона",
                        description: "Уникальная NFT награда за посещение достопримечательности Казахстана",
                        rarity: "Редкая",
                        image: scanResult === "bayterek" ? "🏗️" : scanResult === "medeu" ? "⛸️" : "🏔️",
                      }
                      onSuccess(nftToSend)
                    }}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Забрать награду
                  </Button>
                  <Button onClick={() => setScanResult("")} variant="outline" className="w-full">
                    Сканировать еще
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
