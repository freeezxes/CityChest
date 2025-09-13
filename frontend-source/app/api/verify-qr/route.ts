import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { qrCode } = await request.json()

    const validQRCodes = ["bayterek", "medeu", "charyn"]

    if (!validQRCodes.includes(qrCode)) {
      return NextResponse.json({ error: "Неверный QR код" }, { status: 400 })
    }

    const reward = {
      qrCode,
      timestamp: new Date().toISOString(),
      nftReward: `nft_${qrCode}_${Date.now()}`,
      points: 100,
    }

    console.log("[v0] Обработан QR код:", reward)

    return NextResponse.json({
      success: true,
      message: "QR код успешно обработан",
      reward,
    })
  } catch (error) {
    console.error("[v0] Ошибка обработки QR:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
