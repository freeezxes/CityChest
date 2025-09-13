<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NFT extends Model
{
    protected $table = 'n_f_t_s';

    protected $fillable = [
        'name',
        'description',
        'image_url',
        'rarity',
        'attraction_id',
        'drop_chance'
    ];

    /**
     * Get the attraction that this NFT belongs to
     */
    public function attraction()
    {
        return $this->belongsTo(Attraction::class);
    }

    /**
     * Check if this NFT should be won based on its drop chance
     *
     * @return bool
     */
    public function shouldDrop()
    {
        // Generate a random number between 1 and 100
        $random = mt_rand(1, 100);

        // If random number is less than or equal to drop_chance, the NFT is won
        return $random <= $this->drop_chance;
    }

    /**
     * Get the users who have won this NFT
     */
    public function userNfts()
    {
        return $this->hasMany(UserNFT::class);
    }
}
