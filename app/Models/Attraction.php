<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attraction extends Model
{
    protected $fillable = [
        'name',
        'description',
        'location',
        'lat',
        'lon'
    ];

    /**
     * Get the NFTs associated with this attraction
     */
    public function nfts()
    {
        return $this->hasMany(NFT::class);
    }

    /**
     * Get a random NFT from this attraction based on drop chance
     *
     * @return NFT|null
     */
    public function getRandomNft()
    {
        return $this->nfts()->inRandomOrder()->first();
    }
}
