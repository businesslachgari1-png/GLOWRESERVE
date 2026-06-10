<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Add a review for an appointment
     */
    public function store(Request $request)
    {
        $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        // Check if user owns the appointment
        $appointment = \App\Models\Appointment::where('id', $request->appointment_id)
            ->where('client_id', $request->user()->id)
            ->where('status', 'completed')
            ->firstOrFail();

        // Check if review already exists
        if ($appointment->review) {
            return response()->json(['error' => 'Vous avez déjà laissé un avis'], 400);
        }

        $review = Review::create([
            'appointment_id' => $request->appointment_id,
            'client_id' => $request->user()->id,
            'salon_id' => $appointment->salon_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        // Update salon rating
        $this->updateSalonRating($appointment->salon_id);

        return response()->json($review, 201);
    }

    /**
     * Get reviews for a salon
     */
    public function salonReviews($salonId)
    {
        $reviews = Review::where('salon_id', $salonId)
            ->with('client:id,name,avatar')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reviews);
    }

    /**
     * Update salon average rating
     */
    private function updateSalonRating($salonId)
    {
        $avgRating = Review::where('salon_id', $salonId)->avg('rating');
        \App\Models\Salon::where('id', $salonId)->update(['rating' => round($avgRating, 2)]);
    }
}
