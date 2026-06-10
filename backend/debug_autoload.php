<?php

require __DIR__ . '/vendor/autoload.php';

if (class_exists('App\Providers\AppServiceProvider')) {
    echo "Class App\Providers\AppServiceProvider found!\n";
} else {
    echo "Class App\Providers\AppServiceProvider NOT found.\n";
    echo "Current directory: " . getcwd() . "\n";
    echo "File expected at: " . __DIR__ . '/app/Providers/AppServiceProvider.php' . "\n";
    if (file_exists(__DIR__ . '/app/Providers/AppServiceProvider.php')) {
        echo "File exists.\n";
    } else {
        echo "File does NOT exist.\n";
    }
}
