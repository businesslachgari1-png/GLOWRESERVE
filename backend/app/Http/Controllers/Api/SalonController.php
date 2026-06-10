<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Salon;
use Illuminate\Http\Request;

class SalonController extends Controller
{
    public function index(Request $request)
    {
        $salons = Salon::with('services');

        if ($request->has('city')) {
            $salons->where('city', 'like', '%' . $request->city . '%');
        }

        if ($request->has('category')) {
            $salons->whereHas('services', function($query) use ($request) {
                $query->where('category', $request->category);
            });
        }

        return response()->json($salons->paginate(15));
    }

    public function show($slug)
    {
        $salon = Salon::with(['services', 'owner', 'employees'])->where('slug', $slug)->firstOrFail();
        return response()->json($salon);
    }
}
