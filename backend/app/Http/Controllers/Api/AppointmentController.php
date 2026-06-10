<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Service;
use App\Models\Employee;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    /**
     * Get available time slots for a service
     */
    public function getAvailableSlots(Request $request)
    {
        $request->validate([
            'salon_id' => 'required|exists:salons,id',
            'service_id' => 'required|exists:services,id',
            'employee_id' => 'nullable|exists:employees,id',
            'date' => 'required|date|after_or_equal:today',
        ]);

        $service = Service::findOrFail($request->service_id);
        $date = Carbon::parse($request->date);
        
        // Get salon opening hours (simplified - would need proper implementation)
        $openingHour = 9;
        $closingHour = 19;
        $slotDuration = $service->duration_minutes;
        
        $slots = [];
        $currentTime = $date->copy()->setTime($openingHour, 0);
        $endTime = $date->copy()->setTime($closingHour, 0);

        while ($currentTime->lt($endTime)) {
            // Check if slot is available
            $isAvailable = !Appointment::where('salon_id', $request->salon_id)
                ->where('appointment_time', $currentTime)
                ->when($request->employee_id, function($query) use ($request) {
                    return $query->where('employee_id', $request->employee_id);
                })
                ->whereIn('status', ['pending', 'confirmed'])
                ->exists();

            if ($isAvailable) {
                $slots[] = [
                    'time' => $currentTime->format('H:i'),
                    'datetime' => $currentTime->toIso8601String(),
                ];
            }

            $currentTime->addMinutes($slotDuration);
        }

        return response()->json($slots);
    }

    /**
     * Create a new appointment
     */
    public function store(Request $request)
    {
        $request->validate([
            'salon_id' => 'required|exists:salons,id',
            'service_id' => 'required|exists:services,id',
            'employee_id' => 'nullable|exists:employees,id',
            'appointment_time' => 'required|date|after:now',
            'notes' => 'nullable|string',
        ]);

        $service = Service::findOrFail($request->service_id);

        // Check if slot is still available
        $exists = Appointment::where('salon_id', $request->salon_id)
            ->where('appointment_time', $request->appointment_time)
            ->when($request->employee_id, function($query) use ($request) {
                return $query->where('employee_id', $request->employee_id);
            })
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();

        if ($exists) {
            return response()->json(['error' => 'Ce créneau n\'est plus disponible'], 409);
        }

        $appointment = Appointment::create([
            'client_id' => $request->user()->id,
            'salon_id' => $request->salon_id,
            'service_id' => $request->service_id,
            'employee_id' => $request->employee_id,
            'appointment_time' => $request->appointment_time,
            'total_price' => $service->price,
            'notes' => $request->notes,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Rendez-vous créé avec succès',
            'appointment' => $appointment->load(['salon', 'service', 'employee']),
        ], 201);
    }

    /**
     * Get user's appointments
     */
    public function myAppointments(Request $request)
    {
        $appointments = Appointment::where('client_id', $request->user()->id)
            ->with(['salon', 'service', 'employee', 'payment', 'review'])
            ->orderBy('appointment_time', 'desc')
            ->get();

        return response()->json($appointments);
    }

    /**
     * Cancel an appointment
     */
    public function cancel(Request $request, $id)
    {
        $appointment = Appointment::where('id', $id)
            ->where('client_id', $request->user()->id)
            ->firstOrFail();

        if ($appointment->status === 'completed' || $appointment->status === 'cancelled') {
            return response()->json(['error' => 'Impossible d\'annuler ce rendez-vous'], 400);
        }

        $appointment->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Rendez-vous annulé']);
    }

    /**
     * Get client's completed appointments for a given salon (to decide if user can leave a review)
     */
    public function completedAppointmentsForSalon(Request $request, $salonId)
    {
        $appointments = Appointment::where('client_id', $request->user()->id)
            ->where('salon_id', $salonId)
            ->where('status', 'completed')
            ->with(['service', 'employee', 'review'])
            ->orderBy('appointment_time', 'desc')
            ->get();

        return response()->json($appointments);
    }
}

