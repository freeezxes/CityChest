"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Star, Trophy, Share2 } from "lucide-react"

interface SuccessScreenProps {
  nftData: {
    id: string
    name: string
    description: string
    rarity: string
    image: string
  }
  onGoHome: () => void
}

export default function SuccessScreen({ nftData, onGoHome }: SuccessScreenProps) {
  // @TODO: Добавить функцию для отправки статистики на бэкенд через axios
  const handleShareNFT = async () => {
    // @TODO: Интеграция с бэкендом для шаринга NFT
    // const response = await axios.post('/api/share-nft', { nftId: nftData.id })
    console.log("Sharing NFT:", nftData.id)
  }

  // @TODO: Добавить функцию для обновления статистики пользователя
  const updateUserStats = async () => {
    // @TODO: Отправить обновленную статистику на бэкенд
    // const response = await axios.post('/api/user/stats', {
    //   nftId: nftData.id,
    //   experiencePoints: 100
    // })
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-sky-600 via-blue-700 to-amber-600 text-white z-50 overflow-y-auto">
      <div className="min-h-full flex flex-col items-center justify-center p-4 py-8">
        <div className="text-center mb-6 animate-bounce">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mb-3 mx-auto shadow-xl">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
            Поздравляем!
          </h1>
          <p className="text-white/90 text-base">Вы получили новую NFT награду!</p>
        </div>

        <Card className="w-full max-w-xs bg-white/15 backdrop-blur-md border-white/30 shadow-xl mb-6">
          <CardContent className="p-4">
            {/* NFT Image */}
            <div className="relative mb-4">
              <div className="w-full aspect-square bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-lg flex items-center justify-center text-4xl shadow-lg">
                {nftData.image}
              </div>
              {/* Rarity Badge */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center shadow-lg">
                <Star className="h-3 w-3 mr-1" />
                {nftData.rarity}
              </div>
            </div>

            {/* NFT Info */}
            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-2">{nftData.name}</h3>
              <p className="text-white/80 text-sm mb-4 leading-relaxed">{nftData.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/10 rounded-lg p-2">
                  <div className="text-lg font-bold text-amber-300">+100</div>
                  <div className="text-xs text-white/70">Очки</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2">
                  <div className="text-lg font-bold text-blue-300">1/50</div>
                  <div className="text-xs text-white/70">Коллекция</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="w-full max-w-xs space-y-3">
          <Button
            onClick={onGoHome}
            className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white py-3 text-base font-semibold shadow-lg transition-all duration-200"
          >
            <Home className="h-4 w-4 mr-2" />
            На главную
          </Button>

          <Button
            onClick={handleShareNFT}
            variant="outline"
            className="w-full border-white/40 text-white hover:bg-white/15 py-3 bg-white/10 backdrop-blur-sm transition-all duration-200"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Поделиться NFT
          </Button>
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping text-amber-300"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                fontSize: "12px",
              }}
            >
              ⭐
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
