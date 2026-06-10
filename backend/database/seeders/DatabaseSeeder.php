<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Salon;
use App\Models\Service;
use App\Models\Employee;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create test users
        $client = User::create([
            'name' => 'Amina El Fassi',
            'email' => 'client@test.com',
            'password' => bcrypt('password'),
            'role' => 'client',
            'email_verified_at' => now(),
        ]);

        $owner1 = User::create([
            'name' => 'Fatine Benjelloun',
            'email' => 'owner1@test.com',
            'password' => bcrypt('password'),
            'role' => 'owner',
            'email_verified_at' => now(),
        ]);

        $owner2 = User::create([
            'name' => 'Omar Mansouri',
            'email' => 'owner2@test.com',
            'password' => bcrypt('password'),
            'role' => 'owner',
            'email_verified_at' => now(),
        ]);

        // Create salons (Morocco)
        $salon1 = Salon::create([
            'owner_id' => $owner1->id,
            'name' => 'Riad de Beauté Casablanca',
            'slug' => 'riad-de-beaute-casablanca-' . Str::random(6),
            'description' => 'Un sanctuaire de luxe au cœur de Casablanca. Profitez de soins ancestraux revisités avec une touche moderne.',
            'address' => '25 Angle Rue Taha Houcine',
            'city' => 'Casablanca',
            'phone' => '05 22 45 67 89',
            'email' => 'contact@riadbeaute.ma',
            'rating' => 4.9,
            'image_url' => 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800',
            'opening_hours' => [
                'monday' => '09:00-19:00',
                'tuesday' => '09:00-19:00',
                'wednesday' => '09:00-19:00',
                'thursday' => '09:00-20:00',
                'friday' => '09:00-20:00',
                'saturday' => '10:00-18:00',
                'sunday' => 'Fermé',
            ],
        ]);

        $salon2 = Salon::create([
            'owner_id' => $owner2->id,
            'name' => 'Espace Majorelle Marrakech',
            'slug' => 'espace-majorelle-marrakech-' . Str::random(6),
            'description' => 'L\'excellence du bien-être à Marrakech. Un cadre enchanteur pour des rituels de beauté d\'exception.',
            'address' => 'Avenue Yacoub El Marini, Guéliz',
            'city' => 'Marrakech',
            'phone' => '05 24 33 44 55',
            'email' => 'marrakech@majorelle.ma',
            'rating' => 5.0,
            'image_url' => 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=800',
            'opening_hours' => [
                'monday' => '10:00-19:00',
                'tuesday' => '10:00-19:00',
                'wednesday' => '10:00-19:00',
                'thursday' => '10:00-20:00',
                'friday' => '10:00-20:00',
                'saturday' => '09:00-18:00',
                'sunday' => 'Fermé',
            ],
        ]);

        $salon3 = Salon::create([
            'owner_id' => $owner1->id,
            'name' => 'Le Pavillon de Soie Rabat',
            'slug' => 'le-pavillon-de-soie-rabat-' . Str::random(6),
            'description' => 'Votre institut prestigieux dans la capitale. Raffinement et expertise pour chaque client.',
            'address' => '12 Rue Al Arz, Hay Riad',
            'city' => 'Rabat',
            'phone' => '05 37 77 88 99',
            'email' => 'rabat@pavillonsoie.ma',
            'rating' => 4.8,
            'image_url' => 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&q=80&w=800',
        ]);

        // Create services for salon 1
        $services1 = [
            ['name' => 'Coupe & Brushing Signature', 'description' => 'Coupe adaptée à votre visage avec protection thermique', 'price' => 250.00, 'duration_minutes' => 60, 'category' => 'Coiffure'],
            ['name' => 'Hammams & Soins Corporels', 'description' => 'Rituel complet avec gommage au savon noir', 'price' => 400.00, 'duration_minutes' => 90, 'category' => 'Bien-être'],
            ['name' => 'Balayage Oriental', 'description' => 'Éclaircissement naturel pour un effet lumineux', 'price' => 600.00, 'duration_minutes' => 150, 'category' => 'Coiffure'],
            ['name' => 'Massage Relaxant à l\'Argan', 'description' => 'Détente profonde aux huiles précieuses du Maroc', 'price' => 350.00, 'duration_minutes' => 60, 'category' => 'Soins'],
        ];

        foreach ($services1 as $serviceData) {
            $salon1->services()->create($serviceData);
        }

        // Create services for salon 2
        $services2 = [
            ['name' => 'Soins du Visage Prestige', 'description' => 'Traitement revitalisant aux extraits naturels', 'price' => 500.00, 'duration_minutes' => 75, 'category' => 'Visage'],
            ['name' => 'Manucure & Pédicure Orientale', 'description' => 'Soin complet des ongles avec gommage', 'price' => 300.00, 'duration_minutes' => 70, 'category' => 'Mains & Pieds'],
        ];

        foreach ($services2 as $serviceData) {
            $salon2->services()->create($serviceData);
        }

        // Create services for salon 3
        $services3 = [
            ['name' => 'Lissage à la Kératine', 'description' => 'Lissage intense pour des cheveux soyeux', 'price' => 1200.00, 'duration_minutes' => 180, 'category' => 'Coiffure'],
            ['name' => 'Extension de Cils', 'description' => 'Pose cil à cil pour un regard naturel et profond', 'price' => 450.00, 'duration_minutes' => 90, 'category' => 'Regard'],
        ];

        foreach ($services3 as $serviceData) {
            $salon3->services()->create($serviceData);
        }

        // Create employees
        $employee1 = Employee::create([
            'salon_id' => $salon1->id,
            'name' => 'Salma Bennani',
            'role' => 'Coiffeuse Styliste',
            'bio' => 'Experte en coupes et visagisme avec 12 ans d\'expérience.',
            'is_active' => true,
        ]);

        $employee2 = Employee::create([
            'salon_id' => $salon1->id,
            'name' => 'Hafsa Alami',
            'role' => 'Thérapeute Spa',
            'bio' => 'Spécialiste des massages traditionnels et rituels orientaux.',
            'is_active' => true,
        ]);

        $employee3 = Employee::create([
            'salon_id' => $salon2->id,
            'name' => 'Youssef Filali',
            'role' => 'Barbier & Styliste Homme',
            'bio' => 'Maître barbier spécialisé dans les finitions précises.',
            'is_active' => true,
        ]);

        // Attach services to employees
        $employee1->services()->attach($salon1->services->where('category', 'Coiffure')->pluck('id'));
        $employee2->services()->attach($salon1->services->where('category', 'Bien-être')->pluck('id'));
        $employee3->services()->attach($salon2->services->pluck('id'));

        $this->command->info('✅ Base de données marocaine peuplée avec succès !');
    }
}
