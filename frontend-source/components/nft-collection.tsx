"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Trophy, Gift } from "lucide-react"

interface NFTCollectionProps {
  nfts: string[]
  onBack: () => void
}

const nftData = {
  "Золотой Байтерек": {
    image: "/placeholder-xpbyo.png",
    rarity: "Легендарный",
    description: "Символ современного Казахстана в золотом исполнении",
    power: 95,
  },
  "Ледяная корона Медеу": {
    image: "/placeholder-nsmjn.png",
    rarity: "Эпический",
    description: "Корона высокогорного катка мирового класса",
    power: 85,
  },
  "Дух каньона": {
    image: "/placeholder-rnnuy.png",
    rarity: "Редкий",
    description: "Мистический дух величественного каньона",
    power: 75,
  },
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "Легендарный":
      return "bg-gradient-to-r from-yellow-400 to-orange-500"
    case "Эпический":
      return "bg-gradient-to-r from-purple-400 to-pink-500"
    case "Редкий":
      return "bg-gradient-to-r from-blue-400 to-cyan-500"
    default:
      return "bg-gradient-to-r from-gray-400 to-gray-500"
  }
}

export default function NFTCollection({ nfts, onBack }: NFTCollectionProps) {
  const totalPower = nfts.reduce((sum, nft) => {
    const data = nftData[nft as keyof typeof nftData]
    return sum + (data?.power || 0)
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/20">
        <Button variant="ghost" onClick={onBack} className="text-white">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Назад
        </Button>
        <h1 className="text-lg font-semibold">Моя коллекция NFT</h1>
        <div></div>
      </div>

      {/* Stats */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-white/10 border-white/20 text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-secondary">{nfts.length}</div>
              <div className="text-sm text-white/70">Собрано NFT</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-primary">{totalPower}</div>
              <div className="text-sm text-white/70">Общая сила</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-400">
                {Math.round((nfts.length / Object.keys(nftData).length) * 100)}%
              </div>
              <div className="text-sm text-white/70">Завершено</div>
            </CardContent>
          </Card>
        </div>

        {/* Collection */}
        {nfts.length === 0 ? (
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-8 text-center">
              <Gift className="h-16 w-16 text-white/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Коллекция пуста</h3>
              <p className="text-white/70 mb-4">
                Начните сканировать QR коды достопримечательностей, чтобы собрать уникальные NFT!
              </p>
              <Button onClick={onBack} className="bg-primary hover:bg-primary/90">
                Начать исследование
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nfts.map((nft, index) => {
              const data = nftData[nft as keyof typeof nftData]
              if (!data) return null

              return (
                <Card key={index} className="bg-white/10 border-white/20 overflow-hidden bounce-in">
                  <div className={`h-2 ${getRarityColor(data.rarity)}`}></div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">{nft}</CardTitle>
                      <Badge className={`${getRarityColor(data.rarity)} text-white border-0`}>{data.rarity}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-white/5">
                      <img src={data.image || "/placeholder.svg"} alt={nft} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-white/80 text-sm mb-3">{data.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-medium">Сила: {data.power}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-white/60">
                        <Trophy className="h-3 w-3" />
                        Уникальный
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Available NFTs */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Доступные для сбора
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(nftData).map(([name, data]) => {
              const isCollected = nfts.includes(name)

              return (
                <Card key={name} className={`border-white/20 ${isCollected ? "bg-green-900/20" : "bg-white/5"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-lg overflow-hidden ${isCollected ? "" : "grayscale opacity-50"}`}
                      >
                        <img src={data.image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${isCollected ? "text-green-400" : "text-white/70"}`}>{name}</h3>
                        <Badge className={`${getRarityColor(data.rarity)} text-white border-0 text-xs`}>
                          {data.rarity}
                        </Badge>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="h-3 w-3 text-yellow-400" />
                          <span className="text-xs">Сила: {data.power}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {isCollected ? (
                          <div className="text-green-400 text-sm font-medium">✓ Собрано</div>
                        ) : (
                          <div className="text-white/50 text-sm">Не собрано</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
