<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserNFT extends Model
{
    protected $table = 'user_nfts';

    protected $fillable = [
        'telegram_id',
        'nft_id',
        'won_at'
    ];

    /**
     * Get the NFT that belongs to this user
     */
    public function nft()
    {
        return $this->belongsTo(NFT::class);
    }
}
