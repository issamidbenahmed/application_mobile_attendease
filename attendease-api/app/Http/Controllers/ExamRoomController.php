<?php

namespace App\Http\Controllers;

use App\Models\ExamRoom;
use Illuminate\Http\Request;

class ExamRoomController extends Controller
{
    public function index()
    {
        $rooms = ExamRoom::all();
        return response()->json($rooms);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'capacity' => 'nullable|integer|min:1'
        ]);

        $room = ExamRoom::create($validated);
        return response()->json($room, 201);
    }

    public function show(ExamRoom $room)
    {
        return response()->json($room);
    }

    public function update(Request $request, ExamRoom $room)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'capacity' => 'nullable|integer|min:1'
        ]);

        $room->update($validated);
        return response()->json($room);
    }

    public function destroy(ExamRoom $room)
    {
        $room->delete();
        return response()->json(null, 204);
    }
} 