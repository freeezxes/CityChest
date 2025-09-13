<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\Attraction;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Get all attractions to create NFTs for them
        $attractions = DB::table('attractions')->get();
        $now = now();

        // Rarity levels with their drop chances
        $rarities = [
            'common'    => 50,     // 50% chance to drop
            'uncommon'  => 30,   // 30% chance to drop
            'rare'      => 15,       // 15% chance to drop
            'epic'      => 5,        // 5% chance to drop
            'legendary' => 1    // 1% chance to drop
        ];

        // NFT data to insert
        $nfts = [];

        // For each attraction, create multiple NFTs with different rarities
        foreach ($attractions as $attraction) {
            // Common NFT
            $nfts[] = [
                'name'          => 'Common ' . $attraction->name . ' Badge',
                'description'   => 'A common collectible badge from ' . $attraction->name,
                'image_url'     => 'https://picsum.photos/400/400?random=' . uniqid(),
                'rarity'        => 'common',
                'attraction_id' => $attraction->id,
                'drop_chance'   => $rarities['common'],
                'created_at'    => $now,
                'updated_at'    => $now,
            ];

            // Uncommon NFT
            $nfts[] = [
                'name'          => 'Uncommon ' . $attraction->name . ' Emblem',
                'description'   => 'An uncommon emblem representing ' . $attraction->name,
                'image_url'     => 'https://picsum.photos/400/400?random=' . uniqid(),
                'rarity'        => 'uncommon',
                'attraction_id' => $attraction->id,
                'drop_chance'   => $rarities['uncommon'],
                'created_at'    => $now,
                'updated_at'    => $now,
            ];

            // Rare NFT
            $nfts[] = [
                'name'          => 'Rare ' . $attraction->name . ' Medallion',
                'description'   => 'A rare medallion from ' . $attraction->name . ' with special details',
                'image_url'     => 'https://picsum.photos/400/400?random=' . uniqid(),
                'rarity'        => 'rare',
                'attraction_id' => $attraction->id,
                'drop_chance'   => $rarities['rare'],
                'created_at'    => $now,
                'updated_at'    => $now,
            ];

            // Epic NFT
            $nfts[] = [
                'name'          => 'Epic ' . $attraction->name . ' Trophy',
                'description'   => 'An epic trophy commemorating your visit to ' . $attraction->name,
                'image_url'     => 'https://picsum.photos/400/400?random=' . uniqid(),
                'rarity'        => 'epic',
                'attraction_id' => $attraction->id,
                'drop_chance'   => $rarities['epic'],
                'created_at'    => $now,
                'updated_at'    => $now,
            ];

            // Legendary NFT
            $nfts[] = [
                'name'          => 'Legendary ' . $attraction->name . ' Artifact',
                'description'   => 'A legendary artifact that captures the essence of ' . $attraction->name,
                'image_url'     => 'https://picsum.photos/400/400?random=' . uniqid(),
                'rarity'        => 'legendary',
                'attraction_id' => $attraction->id,
                'drop_chance'   => $rarities['legendary'],
                'created_at'    => $now,
                'updated_at'    => $now,
            ];
        }

        // Insert NFTs in batches to avoid memory issues
        foreach (array_chunk($nfts, 100) as $chunk) {
            DB::table('n_f_t_s')->insert($chunk);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('n_f_t_s')->truncate();
    }
};
