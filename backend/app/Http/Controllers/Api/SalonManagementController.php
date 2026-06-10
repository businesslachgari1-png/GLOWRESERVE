<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Salon;
use App\Models\Service;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SalonManagementController extends Controller
{
    /**
     * Get salon owned by authenticated user
     */
    public function mySalon(Request $request)
    {
        $salon = Salon::where('owner_id', $request->user()->id)
            ->with(['services', 'employees'])
            ->first();

        if (!$salon) {
            return response()->json(['message' => 'Aucun salon trouvé'], 404);
        }

        return response()->json($salon);
    }

    /**
     * Create or update salon
     */
    public function storeSalon(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'required|string',
            'city' => 'required|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'opening_hours' => 'nullable|array',
        ]);

        $salon = Salon::updateOrCreate(
            ['owner_id' => $request->user()->id],
            [
                'name' => $request->name,
                'slug' => Str::slug($request->name) . '-' . Str::random(6),
                'description' => $request->description,
                'address' => $request->address,
                'city' => $request->city,
                'phone' => $request->phone,
                'email' => $request->email,
                'opening_hours' => $request->opening_hours,
            ]
        );

        return response()->json($salon, 201);
    }

    /**
     * Add service to salon
     */
    public function addService(Request $request)
    {
        $salon = Salon::where('owner_id', $request->user()->id)->firstOrFail();

        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_minutes' => 'required|integer|min:15',
            'category' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // 2MB Max
        ]);

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('services', 'public');
            $data['image_url'] = '/storage/' . $imagePath;
        }

        $service = $salon->services()->create($data);

        return response()->json($service, 201);
    }

    /**
     * Update service
     */
    public function updateService(Request $request, $id)
    {
        $salon = Salon::where('owner_id', $request->user()->id)->firstOrFail();
        $service = $salon->services()->findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'duration_minutes' => 'sometimes|required|integer|min:15',
            'category' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('services', 'public');
            $data['image_url'] = '/storage/' . $imagePath;
        }

        $service->update($data);

        return response()->json($service);
    }

    /**
     * Delete service
     */
    public function deleteService(Request $request, $id)
    {
        $salon = Salon::where('owner_id', $request->user()->id)->firstOrFail();
        $service = $salon->services()->findOrFail($id);
        $service->delete();

        return response()->json(['message' => 'Service supprimé']);
    }

    /**
     * Add employee
     */
    public function addEmployee(Request $request)
    {
        $salon = Salon::where('owner_id', $request->user()->id)->firstOrFail();

        $request->validate([
            'name' => 'required|string',
            'role' => 'nullable|string',
            'bio' => 'nullable|string',
            'service_ids' => 'nullable|array',
            'service_ids.*' => 'exists:services,id',
        ]);

        $employee = $salon->employees()->create([
            'name' => $request->name,
            'role' => $request->role,
            'bio' => $request->bio,
        ]);

        if ($request->service_ids) {
            $employee->services()->attach($request->service_ids);
        }

        return response()->json($employee->load('services'), 201);
    }

    /**
     * Get salon appointments
     */
    public function salonAppointments(Request $request)
    {
        $salon = Salon::where('owner_id', $request->user()->id)->firstOrFail();

        $appointments = $salon->appointments()
            ->with(['client', 'service', 'employee', 'payment'])
            ->orderBy('appointment_time', 'desc')
            ->get();

        return response()->json($appointments);
    }

    /**
     * Update appointment status
     */
    public function updateAppointmentStatus(Request $request, $id)
    {
        $salon = Salon::where('owner_id', $request->user()->id)->firstOrFail();
        
        $appointment = $salon->appointments()->findOrFail($id);

        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
        ]);

        $appointment->update(['status' => $request->status]);

        return response()->json($appointment);
    }
}
