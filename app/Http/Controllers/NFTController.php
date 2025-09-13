<?php

namespace App\Http\Controllers;

use App\Models\Attraction;
use App\Models\NFT;
use App\Models\UserNFT;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NFTController extends Controller
{
    /**
     * Display a listing of NFTs
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function index()
    {
        return NFT::all();
    }

    /**
     * Display NFTs for a specific attraction
     *
     * @param int $attractionId
     * @return \Illuminate\Http\Response
     */
    public function getByAttraction($attractionId)
    {
        return NFT::where('attraction_id', $attractionId)->get();
    }

    /**
     * Try to win an NFT from a specific attraction
     *
     * @param Request $request
     * @param int $attractionId
     * @return \Illuminate\Http\JsonResponse
     */
    public function tryWinNft(Request $request, int $attractionId)
    {
        // Validate request
        $request->validate([
            'telegram_id' => 'required|string',
        ]);

        $attraction = Attraction::findOrFail($attractionId);
        $nft = $attraction->getRandomNft();

        if ($nft) {
            // Record the NFT win with telegram_id
            UserNFT::create([
                'telegram_id' => $request->telegram_id,
                'nft_id' => $nft->id,
                'won_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Congratulations! You won an NFT!',
                'nft' => $nft
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Sorry, you did not win an NFT this time. Try again later!'
            ]);
        }
    }

    /**
     * Get NFTs by rarity
     *
     * @param string $rarity
     * @return \LaravelIdea\Helper\App\Models\_IH_NFT_C|NFT[]
     */
    public function getByRarity($rarity)
    {
        return NFT::where('rarity', $rarity)->get();
    }

    /**
     * Get NFTs won by a specific Telegram user
     *
     * @param string $telegramId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByTelegramId(string $telegramId)
    {
        $userNfts = UserNFT::where('telegram_id', $telegramId)
            ->with('nft')
            ->get();

        return response()->json([
            'count' => $userNfts->count(),
            'nfts' => $userNfts->map(function($userNft) {
                return [
                    'id' => $userNft->nft->id,
                    'name' => $userNft->nft->name,
                    'description' => $userNft->nft->description,
                    'image_url' => $userNft->nft->image_url,
                    'rarity' => $userNft->nft->rarity,
                    'attraction_id' => $userNft->nft->attraction_id,
//                    'won_at' => $userNft->won_at
                ];
            })
        ]);
    }
}
