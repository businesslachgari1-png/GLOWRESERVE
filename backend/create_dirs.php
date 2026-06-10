<?php

$dirs = [
    "storage/app/public",
    "storage/framework/cache/data",
    "storage/framework/sessions",
    "storage/framework/testing",
    "storage/framework/views",
    "storage/logs",
    "bootstrap/cache",
    "routes",
    "public"
];

foreach ($dirs as $dir) {
    if (!file_exists($dir)) {
        mkdir($dir, 0777, true);
        echo "Created $dir\n";
    } else {
        echo "Exists $dir\n";
    }
}
