<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserType;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

class UserManagementController extends Controller
{
    use AuthorizesRequests;
    /**
        * @OA\Get(
        *     path="/api/users",
        *     summary="Get all users",
        *     tags={"User Management"},
        *     security={{"sanctum":{}}},
        *     @OA\Parameter(
        *         name="page",
        *         in="query",
        *         description="Page number",
        *         required=false,
        *         @OA\Schema(type="integer", default=1)
        *     ),
        *     @OA\Parameter(
        *         name="per_page",
        *         in="query",
        *         description="Items per page",
        *         required=false,
        *         @OA\Schema(type="integer", default=15)
        *     ),
        *     @OA\Parameter(
        *         name="search",
        *         in="query",
        *         description="Search term",
        *         required=false,
        *         @OA\Schema(type="string")
        *     ),
        *     @OA\Response(
        *         response=200,
        *         description="List of users",
        *         @OA\JsonContent(
        *             @OA\Property(property="users", type="object")
        *         )
        *     ),
        *     @OA\Response(
        *         response=401,
        *         description="Unauthenticated"
        *     ),
        *     @OA\Response(
        *         response=403,
        *         description="Forbidden"
        *     )
        * )
        */
    public function index(Request $request)
    {
        $this->authorize('view users');

        $perPage = $request->get('per_page', 15);
        $search = $request->get('search', '');
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $userTypeId = $request->get('user_type_id');
        $status = $request->get('status'); // 'verified', 'unverified', 'all'
        $createdFrom = $request->get('created_from');
        $createdTo = $request->get('created_to');

        // Validate sort column to prevent SQL injection
        $allowedSortColumns = ['id', 'name', 'email', 'created_at', 'updated_at', 'user_type_id', 'city', 'country'];
        if (!in_array($sortBy, $allowedSortColumns)) {
            $sortBy = 'created_at';
        }

        $sortOrder = strtolower($sortOrder) === 'asc' ? 'asc' : 'desc';

        $query = User::with(['roles', 'userType']);

        // Search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('country', 'like', "%{$search}%");
            });
        }

        // User type filter
        if ($userTypeId) {
            $query->where('user_type_id', $userTypeId);
        }

        // Email verification status filter
        if ($status === 'verified') {
            $query->whereNotNull('email_verified_at');
        } elseif ($status === 'unverified') {
            $query->whereNull('email_verified_at');
        }

        // Date range filters
        if ($createdFrom) {
            $query->whereDate('created_at', '>=', $createdFrom);
        }
        if ($createdTo) {
            $query->whereDate('created_at', '<=', $createdTo);
        }

        // Apply sorting
        $query->orderBy($sortBy, $sortOrder);

        $users = $query->paginate($perPage);

        return response()->json([
            'users' => $users->items(),
            'pagination' => [
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'from' => $users->firstItem(),
                'to' => $users->lastItem()
            ]
        ]);
    }
    /**
     * @OA\Get(
     *     path="/api/users/{id}",
     *     summary="Get user by ID",
     *     tags={"User Management"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="User ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User details",
     *         @OA\JsonContent(
     *             @OA\Property(property="user", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden"
     *     )
     * )
     */
    public function show($id)
    {
        $this->authorize('view users');

        $user = User::with(['roles', 'userType'])->findOrFail($id);

        return response()->json([
            'user' => $user
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/users",
     *     summary="Create a new user",
     *     tags={"User Management"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","email","password","password_confirmation","user_type_id"},
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="StrongPassword123"),
     *             @OA\Property(property="password_confirmation", type="string", format="password", example="StrongPassword123"),
     *             @OA\Property(property="user_type_id", type="integer", example=3),
     *             @OA\Property(property="phone", type="string", example="123-456-7890"),
     *             @OA\Property(property="address_line_1", type="string", example="123 Main St"),
     *             @OA\Property(property="city", type="string", example="New York"),
     *             @OA\Property(property="country", type="string", example="USA")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="user", type="object"),
     *             @OA\Property(property="message", type="string", example="User created successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $this->authorize('create users');

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'user_type_id' => 'required|exists:user_types,id',
            'phone' => 'nullable|string|max:20',
            'address_line_1' => 'nullable|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'address_line_3' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'bio' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_type_id' => $request->user_type_id,
            'phone' => $request->phone,
            'address_line_1' => $request->address_line_1,
            'address_line_2' => $request->address_line_2,
            'address_line_3' => $request->address_line_3,
            'city' => $request->city,
            'state' => $request->state,
            'postal_code' => $request->postal_code,
            'country' => $request->country,
            'bio' => $request->bio,
            'email_verified_at' => now(),  // Admin-created accounts are pre-verified
        ]);

        // Assign role based on user type
        $userType = UserType::find($request->user_type_id);
        if ($userType) {
            $user->assignRole($userType->name);
        }

        return response()->json([
            'user' => $user->load(['roles', 'userType']),
            'message' => 'User created successfully'
        ], 201);
    }

    /**
     * @OA\Put(
     *     path="/api/users/{id}",
     *     summary="Update a user",
     *     tags={"User Management"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="User ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="user_type_id", type="integer", example=3),
     *             @OA\Property(property="phone", type="string", example="123-456-7890"),
     *             @OA\Property(property="address_line_1", type="string", example="123 Main St")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="user", type="object"),
     *             @OA\Property(property="message", type="string", example="User updated successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden"
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        $this->authorize('edit users');

        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'user_type_id' => 'sometimes|required|exists:user_types,id',
            'phone' => 'nullable|string|max:20',
            'address_line_1' => 'nullable|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'address_line_3' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'bio' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        // Update user data
        $user->fill($request->only([
            'name', 'email', 'user_type_id', 'phone',
            'address_line_1', 'address_line_2', 'address_line_3',
            'city', 'state', 'postal_code', 'country', 'bio'
        ]));

        // If user type changed, update roles
        if ($request->has('user_type_id') && $user->isDirty('user_type_id')) {
            // Remove all current roles
            $user->syncRoles([]);

            // Assign new role based on user type
            $userType = UserType::find($request->user_type_id);
            if ($userType) {
                $user->assignRole($userType->name);
            }
        }

        $user->save();

        return response()->json([
            'user' => $user->fresh()->load(['roles', 'userType']),
            'message' => 'User updated successfully'
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/users/{id}",
     *     summary="Delete a user",
     *     tags={"User Management"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="User ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden"
     *     )
     * )
     */
    public function destroy($id)
    {
        $this->authorize('delete users');

        $user = User::findOrFail($id);

        // Prevent deleting yourself
        if (auth()->id() === (int)$id) {
            return response()->json([
                'message' => 'You cannot delete your own account'
            ], 403);
        }

        // Delete user avatar if exists
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->tokens()->delete(); // Delete all tokens
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/users/{id}/reset-password",
     *     summary="Reset user password (admin function)",
     *     tags={"User Management"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="User ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"password","password_confirmation"},
     *             @OA\Property(property="password", type="string", format="password", example="NewStrongPassword123"),
     *             @OA\Property(property="password_confirmation", type="string", format="password", example="NewStrongPassword123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Password reset successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Password reset successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden"
     *     )
     * )
     */
    public function resetPassword(Request $request, $id)
    {
        $this->authorize('edit users');

        $validator = Validator::make($request->all(), [
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::findOrFail($id);
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully'
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/user-types",
     *     summary="Get all user types",
     *     tags={"User Management"},
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of user types",
     *         @OA\JsonContent(
     *             @OA\Property(property="userTypes", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function getUserTypes()
    {
        $userTypes = UserType::all();

        return response()->json([
            'userTypes' => $userTypes
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/roles",
     *     summary="Get all roles",
     *     tags={"User Management"},
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of roles",
     *         @OA\JsonContent(
     *             @OA\Property(property="roles", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden"
     *     )
     * )
     */
    public function getRoles()
    {
        $this->authorize('view users');

        $roles = Role::with('permissions')->get();

        return response()->json([
            'roles' => $roles
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/users/bulk-delete",
     *     summary="Bulk delete users",
     *     tags={"User Management"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"ids"},
     *             @OA\Property(property="ids", type="array", @OA\Items(type="integer"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Users deleted successfully"
     *     )
     * )
     */
    public function bulkDelete(Request $request)
    {
        $this->authorize('delete users');

        $validator = Validator::make($request->all(), [
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|integer|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $ids = $request->ids;
        $currentUserId = auth()->id();

        // Prevent deleting yourself
        if (in_array($currentUserId, $ids)) {
            return response()->json([
                'message' => 'You cannot delete your own account'
            ], 403);
        }

        // Get users to delete their avatars
        $users = User::whereIn('id', $ids)->get();

        foreach ($users as $user) {
            // Delete user avatar if exists
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
            $user->tokens()->delete();
        }

        $deletedCount = User::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => "{$deletedCount} user(s) deleted successfully",
            'deleted_count' => $deletedCount
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/users/bulk-update-type",
     *     summary="Bulk update user types",
     *     tags={"User Management"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"ids", "user_type_id"},
     *             @OA\Property(property="ids", type="array", @OA\Items(type="integer")),
     *             @OA\Property(property="user_type_id", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User types updated successfully"
     *     )
     * )
     */
    public function bulkUpdateType(Request $request)
    {
        $this->authorize('edit users');

        $validator = Validator::make($request->all(), [
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|integer|exists:users,id',
            'user_type_id' => 'required|exists:user_types,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $userType = UserType::find($request->user_type_id);
        $users = User::whereIn('id', $request->ids)->get();

        foreach ($users as $user) {
            $user->user_type_id = $request->user_type_id;
            $user->save();

            // Update roles
            $user->syncRoles([]);
            if ($userType) {
                $user->assignRole($userType->name);
            }
        }

        return response()->json([
            'message' => count($request->ids) . ' user(s) updated successfully',
            'updated_count' => count($request->ids)
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/users/{id}/upload-avatar",
     *     summary="Upload avatar for a user (admin function)",
     *     tags={"User Management"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="User ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(property="avatar", type="string", format="binary")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Avatar uploaded successfully"
     *     )
     * )
     */
    public function uploadAvatar(Request $request, $id)
    {
        $this->authorize('edit users');

        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::findOrFail($id);

        // Delete old avatar if exists
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        // Store new avatar
        $path = $request->file('avatar')->store('avatars', 'public');
        $user->avatar = $path;
        $user->save();

        return response()->json([
            'user' => $user->fresh()->load(['roles', 'userType']),
            'message' => 'Avatar uploaded successfully'
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/users/{id}/avatar",
     *     summary="Delete avatar for a user (admin function)",
     *     tags={"User Management"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="User ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Avatar deleted successfully"
     *     )
     * )
     */
    public function deleteAvatar($id)
    {
        $this->authorize('edit users');

        $user = User::findOrFail($id);

        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->avatar = null;
        $user->save();

        return response()->json([
            'user' => $user->fresh()->load(['roles', 'userType']),
            'message' => 'Avatar deleted successfully'
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/users/stats",
     *     summary="Get user statistics",
     *     tags={"User Management"},
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="User statistics"
     *     )
     * )
     */
    public function getStats()
    {
        $this->authorize('view users');

        $totalUsers = User::count();
        $verifiedUsers = User::whereNotNull('email_verified_at')->count();
        $unverifiedUsers = User::whereNull('email_verified_at')->count();
        $usersThisMonth = User::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $usersLastMonth = User::whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->count();

        $usersByType = User::selectRaw('user_type_id, count(*) as count')
            ->groupBy('user_type_id')
            ->with('userType:id,name')
            ->get()
            ->map(function ($item) {
                return [
                    'user_type_id' => $item->user_type_id,
                    'user_type_name' => $item->userType?->name ?? 'Unknown',
                    'count' => $item->count
                ];
            });

        return response()->json([
            'stats' => [
                'total_users' => $totalUsers,
                'verified_users' => $verifiedUsers,
                'unverified_users' => $unverifiedUsers,
                'users_this_month' => $usersThisMonth,
                'users_last_month' => $usersLastMonth,
                'growth_percentage' => $usersLastMonth > 0
                    ? round((($usersThisMonth - $usersLastMonth) / $usersLastMonth) * 100, 2)
                    : 100,
                'users_by_type' => $usersByType
            ]
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/users/export",
     *     summary="Export users to CSV",
     *     tags={"User Management"},
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="CSV export data"
     *     )
     * )
     */
    public function export(Request $request)
    {
        $this->authorize('view users');

        $users = User::with(['roles', 'userType'])->get();

        $exportData = $users->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'user_type' => $user->userType?->name ?? 'N/A',
                'roles' => $user->roles->pluck('name')->implode(', '),
                'city' => $user->city,
                'state' => $user->state,
                'country' => $user->country,
                'email_verified' => $user->email_verified_at ? 'Yes' : 'No',
                'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $user->updated_at->format('Y-m-d H:i:s'),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $exportData,
            'columns' => ['id', 'name', 'email', 'phone', 'user_type', 'roles', 'city', 'state', 'country', 'email_verified', 'created_at', 'updated_at']
        ]);
    }
}
