import os

dirs = [
    "storage/app/public",
    "storage/framework/cache/data",
    "storage/framework/sessions",
    "storage/framework/testing",
    "storage/framework/views",
    "storage/logs",
    "bootstrap/cache",
    "routes",
    "public"
]

for d in dirs:
    os.makedirs(d, exist_ok=True)
    print(f"Created {d}")
