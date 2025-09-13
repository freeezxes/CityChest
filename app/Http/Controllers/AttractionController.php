<?php

namespace App\Http\Controllers;

use App\Models\Attraction;
use Illuminate\Http\Request;

class AttractionController extends Controller
{
    public function index()
    {
        $attractions = Attraction::with('nfts')->get();

        return $attractions->map(function ($attraction) {
            // Generate a slug-like ID from the name
            $id = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', transliterator_transliterate('Any-Latin; Latin-ASCII', $attraction->name)));

            // Get Russian name from the database name (assuming it's already in Russian)
            $nameRu = $attraction->name;

            // Create English name by transliterating from Russian
            $name = transliterator_transliterate('Any-Latin; Latin-ASCII', $attraction->name);

            // Get possible NFT rewards for this attraction
            $nftRewards = $attraction->nfts->map(function($nft) {
                return [
                    'id' => $nft->id,
                    'name' => $nft->name,
                    'description' => $nft->description,
                    'rarity' => $nft->rarity,
                    'drop_chance' => $nft->drop_chance
                ];
            });

            // Default NFT reward name (use the legendary one if available)
            $legendaryNft = $attraction->nfts->firstWhere('rarity', 'legendary');
            $nftReward = $legendaryNft ? $legendaryNft->name : "NFT " . $name;

            return [
                'id' => $id,
                'name' => $name,
                'nameRu' => $nameRu,
                'location' => $attraction->location,
                'description' => $attraction->description,
                'nftReward' => $nftReward,
                'possibleNfts' => $nftRewards,
                'coordinates' => [
                    'lat' => (float)$attraction->lat,
                    'lng' => (float)$attraction->lon
                ],
                'visited' => false
            ];
        });
    }

    public function show(Attraction $attraction)
    {
        $attraction->load('nfts');

        // Generate a slug-like ID from the name
        $id = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', transliterator_transliterate('Any-Latin; Latin-ASCII', $attraction->name)));

        // Get Russian name from the database name (assuming it's already in Russian)
        $nameRu = $attraction->name;

        // Create English name by transliterating from Russian
        $name = transliterator_transliterate('Any-Latin; Latin-ASCII', $attraction->name);

        // Get possible NFT rewards for this attraction
        $nftRewards = $attraction->nfts->map(function($nft) {
            return [
                'id' => $nft->id,
                'name' => $nft->name,
                'description' => $nft->description,
                'rarity' => $nft->rarity,
                'drop_chance' => $nft->drop_chance
            ];
        });

        // Default NFT reward name (use the legendary one if available)
        $legendaryNft = $attraction->nfts->firstWhere('rarity', 'legendary');
        $nftReward = $legendaryNft ? $legendaryNft->name : "NFT " . $name;

        return [
            'id' => $id,
            'name' => $name,
            'nameRu' => $nameRu,
            'location' => $attraction->location,
            'description' => $attraction->description,
            'nftReward' => $nftReward,
            'possibleNfts' => $nftRewards,
            'coordinates' => [
                'lat' => (float)$attraction->lat,
                'lng' => (float)$attraction->lon
            ],
            'visited' => false
        ];
    }
}
