<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $admin;
    protected UserType $adminType;
    protected UserType $userType;

    protected function setUp(): void
    {
        parent::setUp();

        // Create user types
        $this->adminType = UserType::factory()->create(['name' => 'admin']);
        $this->userType = UserType::factory()->create(['name' => 'user']);

        // Create roles
        Role::create(['name' => 'admin', 'guard_name' => 'api']);
        Role::create(['name' => 'user', 'guard_name' => 'api']);

        // Create admin user
        $this->admin = User::factory()->create([
            'user_type_id' => $this->adminType->id,
        ]);
        $this->admin->assignRole('admin');
        $this->admin->givePermissionTo([
            'view users',
            'create users',
            'edit users',
            'delete users',
        ]);
    }

    /** @test */
    public function it_can_list_users_with_pagination()
    {
        User::factory()->count(25)->create(['user_type_id' => $this->userType->id]);

        $response = $this->actingAs($this->admin, 'api')
            ->getJson('/api/v1/users?per_page=10&page=1');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'users',
                'pagination' => [
                    'total',
                    'per_page',
                    'current_page',
                    'last_page',
                    'from',
                    'to',
                ],
            ])
            ->assertJsonCount(10, 'users');
    }

    /** @test */
    public function it_can_search_users_by_name_or_email()
    {
        User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'user_type_id' => $this->userType->id,
        ]);
        User::factory()->create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'user_type_id' => $this->userType->id,
        ]);

        $response = $this->actingAs($this->admin, 'api')
            ->getJson('/api/v1/users?search=John');

        $response->assertStatus(200);
        $this->assertEquals(1, count($response->json('users')));
        $this->assertEquals('John Doe', $response->json('users.0.name'));
    }

    /** @test */
    public function it_can_sort_users_by_column()
    {
        User::factory()->create(['name' => 'Alice', 'user_type_id' => $this->userType->id]);
        User::factory()->create(['name' => 'Bob', 'user_type_id' => $this->userType->id]);
        User::factory()->create(['name' => 'Charlie', 'user_type_id' => $this->userType->id]);

        $response = $this->actingAs($this->admin, 'api')
            ->getJson('/api/v1/users?sort_by=name&sort_order=asc');

        $response->assertStatus(200);
        $users = $response->json('users');
        $this->assertEquals('Alice', $users[0]['name']);
    }

    /** @test */
    public function it_can_filter_users_by_type()
    {
        User::factory()->count(3)->create(['user_type_id' => $this->adminType->id]);
        User::factory()->count(5)->create(['user_type_id' => $this->userType->id]);

        $response = $this->actingAs($this->admin, 'api')
            ->getJson('/api/v1/users?user_type_id=' . $this->userType->id);

        $response->assertStatus(200);
        $this->assertEquals(5, count($response->json('users')));
    }

    /** @test */
    public function it_can_filter_users_by_verification_status()
    {
        User::factory()->create([
            'email_verified_at' => now(),
            'user_type_id' => $this->userType->id,
        ]);
        User::factory()->create([
            'email_verified_at' => null,
            'user_type_id' => $this->userType->id,
        ]);

        $verifiedResponse = $this->actingAs($this->admin, 'api')
            ->getJson('/api/v1/users?status=verified');

        $verifiedResponse->assertStatus(200);
        // +1 for admin who is verified
        $this->assertGreaterThanOrEqual(1, count($verifiedResponse->json('users')));

        $unverifiedResponse = $this->actingAs($this->admin, 'api')
            ->getJson('/api/v1/users?status=unverified');

        $unverifiedResponse->assertStatus(200);
        $this->assertEquals(1, count($unverifiedResponse->json('users')));
    }

    /** @test */
    public function it_can_create_a_new_user()
    {
        $userData = [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'user_type_id' => $this->userType->id,
            'phone' => '+387 61 123 456',
            'city' => 'Sarajevo',
            'country' => 'Bosnia and Herzegovina',
        ];

        $response = $this->actingAs($this->admin, 'api')
            ->postJson('/api/v1/users', $userData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email', 'phone', 'city', 'country'],
                'message',
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'newuser@example.com',
            'name' => 'New User',
        ]);
    }

    /** @test */
    public function it_validates_required_fields_on_create()
    {
        $response = $this->actingAs($this->admin, 'api')
            ->postJson('/api/v1/users', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password', 'user_type_id']);
    }

    /** @test */
    public function it_can_show_a_single_user()
    {
        $user = User::factory()->create(['user_type_id' => $this->userType->id]);

        $response = $this->actingAs($this->admin, 'api')
            ->getJson('/api/v1/users/' . $user->id);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email', 'roles', 'user_type'],
            ]);
    }

    /** @test */
    public function it_can_update_a_user()
    {
        $user = User::factory()->create([
            'name' => 'Old Name',
            'user_type_id' => $this->userType->id,
        ]);

        $response = $this->actingAs($this->admin, 'api')
            ->putJson('/api/v1/users/' . $user->id, [
                'name' => 'New Name',
                'email' => $user->email,
                'user_type_id' => $this->userType->id,
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'New Name',
        ]);
    }

    /** @test */
    public function it_can_delete_a_user()
    {
        $user = User::factory()->create(['user_type_id' => $this->userType->id]);

        $response = $this->actingAs($this->admin, 'api')
            ->deleteJson('/api/v1/users/' . $user->id);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    /** @test */
    public function it_prevents_self_deletion()
    {
        $response = $this->actingAs($this->admin, 'api')
            ->deleteJson('/api/v1/users/' . $this->admin->id);

        $response->assertStatus(403);
        $this->assertDatabaseHas('users', ['id' => $this->admin->id]);
    }

    /** @test */
    public function it_can_bulk_delete_users()
    {
        $users = User::factory()->count(3)->create(['user_type_id' => $this->userType->id]);
        $ids = $users->pluck('id')->toArray();

        $response = $this->actingAs($this->admin, 'api')
            ->postJson('/api/v1/users/bulk-delete', ['ids' => $ids]);

        $response->assertStatus(200)
            ->assertJson(['deleted_count' => 3]);

        foreach ($ids as $id) {
            $this->assertDatabaseMissing('users', ['id' => $id]);
        }
    }

    /** @test */
    public function it_can_bulk_update_user_types()
    {
        $users = User::factory()->count(3)->create(['user_type_id' => $this->userType->id]);
        $ids = $users->pluck('id')->toArray();

        $response = $this->actingAs($this->admin, 'api')
            ->postJson('/api/v1/users/bulk-update-type', [
                'ids' => $ids,
                'user_type_id' => $this->adminType->id,
            ]);

        $response->assertStatus(200)
            ->assertJson(['updated_count' => 3]);

        foreach ($ids as $id) {
            $this->assertDatabaseHas('users', [
                'id' => $id,
                'user_type_id' => $this->adminType->id,
            ]);
        }
    }

    /** @test */
    public function it_can_reset_user_password()
    {
        $user = User::factory()->create(['user_type_id' => $this->userType->id]);

        $response = $this->actingAs($this->admin, 'api')
            ->postJson('/api/v1/users/' . $user->id . '/reset-password', [
                'password' => 'newpassword123',
                'password_confirmation' => 'newpassword123',
            ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function it_can_get_user_statistics()
    {
        User::factory()->count(5)->create([
            'email_verified_at' => now(),
            'user_type_id' => $this->userType->id,
        ]);
        User::factory()->count(3)->create([
            'email_verified_at' => null,
            'user_type_id' => $this->userType->id,
        ]);

        $response = $this->actingAs($this->admin, 'api')
            ->getJson('/api/v1/users/stats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'stats' => [
                    'total_users',
                    'verified_users',
                    'unverified_users',
                    'users_this_month',
                    'users_last_month',
                    'growth_percentage',
                    'users_by_type',
                ],
            ]);
    }

    /** @test */
    public function it_can_export_users()
    {
        User::factory()->count(5)->create(['user_type_id' => $this->userType->id]);

        $response = $this->actingAs($this->admin, 'api')
            ->postJson('/api/v1/users/export');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data',
                'columns',
            ]);
    }

    /** @test */
    public function it_can_get_user_types()
    {
        $response = $this->actingAs($this->admin, 'api')
            ->getJson('/api/v1/user-types');

        $response->assertStatus(200)
            ->assertJsonStructure(['userTypes']);
    }

    /** @test */
    public function it_can_get_roles()
    {
        $response = $this->actingAs($this->admin, 'api')
            ->getJson('/api/v1/roles');

        $response->assertStatus(200)
            ->assertJsonStructure(['roles']);
    }

    /** @test */
    public function it_can_upload_user_avatar()
    {
        Storage::fake('public');
        $user = User::factory()->create(['user_type_id' => $this->userType->id]);
        $file = UploadedFile::fake()->image('avatar.jpg');

        $response = $this->actingAs($this->admin, 'api')
            ->postJson('/api/v1/users/' . $user->id . '/avatar', [
                'avatar' => $file,
            ]);

        $response->assertStatus(200);
        $this->assertNotNull($user->fresh()->avatar);
    }

    /** @test */
    public function it_can_delete_user_avatar()
    {
        Storage::fake('public');
        $user = User::factory()->create([
            'user_type_id' => $this->userType->id,
            'avatar' => 'avatars/test.jpg',
        ]);

        $response = $this->actingAs($this->admin, 'api')
            ->deleteJson('/api/v1/users/' . $user->id . '/avatar');

        $response->assertStatus(200);
        $this->assertNull($user->fresh()->avatar);
    }

    /** @test */
    public function unauthorized_user_cannot_access_user_management()
    {
        $regularUser = User::factory()->create(['user_type_id' => $this->userType->id]);

        $response = $this->actingAs($regularUser, 'api')
            ->getJson('/api/v1/users');

        $response->assertStatus(403);
    }
}
