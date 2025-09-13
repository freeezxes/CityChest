"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gift, Star, Sparkles } from "lucide-react"

interface LootBoxProps {
  reward: string
  landmarkId: string
  onOpen: (landmarkId: string) => Promise<any>
  onClose: () => void
}

export default function LootBox({ reward, landmarkId, onOpen, onClose }: LootBoxProps) {
  const [isOpening, setIsOpening] = useState(false)
  const [isOpened, setIsOpened] = useState(false)

  const handleOpen = async () => {
    setIsOpening(true)
    setTimeout(async () => {
      setIsOpened(true)
      setIsOpening(false)
      setTimeout(async () => {
        // Pass the landmark ID to the onOpen function
        await onOpen(landmarkId)
      }, 2000)
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <Card className="bg-gradient-to-br from-purple-900 to-blue-900 border-2 border-yellow-400 max-w-sm w-full bounce-in">
        <CardContent className="p-8 text-center text-white">
          {!isOpened ? (
            <>
              <div className="mb-6">
                <div
                  className={`inline-block p-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 ${isOpening ? "animate-spin" : "pulse-glow"}`}
                >
                  <Gift className="h-12 w-12 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-2">{isOpening ? "Открываем лутбокс..." : "Поздравляем!"}</h2>

              <p className="text-white/80 mb-6">
                {isOpening
                  ? "Ваша награда готовится!"
                  : "Вы успешно посетили достопримечательность и получили лутбокс!"}
              </p>

              {!isOpening && (
                <Button
                  onClick={handleOpen}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-6 pulse-glow"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Открыть лутбокс
                </Button>
              )}

              {isOpening && (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-6">
                <div className="inline-block p-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500 bounce-in">
                  <Star className="h-12 w-12 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-2 text-yellow-400">Новый NFT получен!</h2>

              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">{reward}</h3>
                <p className="text-white/80 text-sm">Уникальный NFT добавлен в вашу коллекцию!</p>
              </div>

              <div className="flex items-center justify-center gap-4 text-sm text-white/70">
                <div className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  <span>Редкость: Высокая</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>Уникальный</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
