<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_json_service_response(): void
    {
        $response = $this->get('/');

        $response
            ->assertStatus(200)
            ->assertJson([
                'type' => 'api',
            ]);
    }

    public function test_the_api_status_endpoint_returns_ok(): void
    {
        $response = $this->getJson('/api/status');

        $response
            ->assertStatus(200)
            ->assertJson([
                'status' => 'ok',
            ]);
    }
}
