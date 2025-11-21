#!/bin/bash

# Laravel Deep Content Scanner
# Captures actual content of your Laravel API files for detailed analysis

echo "📸 LARAVEL DEEP CONTENT SNAPSHOT"
echo "================================="
echo "Scanned on: $(date)"
echo "Directory: $(pwd)"
echo "================================="

# Set Laravel root - detected from your structure
LARAVEL_ROOT="src"

if [ ! -d "$LARAVEL_ROOT" ]; then
    echo "❌ Laravel source directory 'src' not found!"
    echo "Please run this script from your project root directory"
    exit 1
fi

echo ""
echo "🎯 LARAVEL ROOT DETECTED: $LARAVEL_ROOT"
echo "================================="

echo ""
echo "📋 COMPOSER.JSON CONTENT:"
echo "-------------------------"
if [ -f "$LARAVEL_ROOT/composer.json" ]; then
    cat "$LARAVEL_ROOT/composer.json"
else
    echo "❌ composer.json not found in $LARAVEL_ROOT"
fi

echo ""
echo "🔧 KEY CONFIGURATION FILES:"
echo "---------------------------"

# .env.example
if [ -f "$LARAVEL_ROOT/.env.example" ]; then
    echo ""
    echo "📄 === .env.example ==="
    cat "$LARAVEL_ROOT/.env.example"
fi

# artisan
if [ -f "$LARAVEL_ROOT/artisan" ]; then
    echo ""
    echo "📄 === artisan (first 20 lines) ==="
    head -20 "$LARAVEL_ROOT/artisan"
fi

echo ""
echo "🗄️ DATABASE STRUCTURE:"
echo "----------------------"

# Migrations
echo "📄 MIGRATIONS:"
if [ -d "$LARAVEL_ROOT/database/migrations" ]; then
    ls -la "$LARAVEL_ROOT/database/migrations/"
    echo ""
    echo "Latest 3 migration files content:"
    ls -t "$LARAVEL_ROOT/database/migrations/"*.php | head -3 | while read file; do
        echo ""
        echo "📄 === $(basename "$file") ==="
        cat "$file"
    done
fi

# Seeders
echo ""
echo "📄 SEEDERS:"
if [ -d "$LARAVEL_ROOT/database/seeders" ]; then
    ls -la "$LARAVEL_ROOT/database/seeders/"
    
    # Show DatabaseSeeder content
    if [ -f "$LARAVEL_ROOT/database/seeders/DatabaseSeeder.php" ]; then
        echo ""
        echo "📄 === DatabaseSeeder.php ==="
        cat "$LARAVEL_ROOT/database/seeders/DatabaseSeeder.php"
    fi
fi

echo ""
echo "🎮 CONTROLLERS:"
echo "--------------"
if [ -d "$LARAVEL_ROOT/app/Http/Controllers" ]; then
    echo "Controller files found:"
    find "$LARAVEL_ROOT/app/Http/Controllers" -name "*.php" -type f
    echo ""
    
    # Show content of all controllers
    find "$LARAVEL_ROOT/app/Http/Controllers" -name "*.php" -type f | while read controller; do
        echo "📄 === $(basename "$controller") ==="
        cat "$controller"
        echo ""
        echo "--- END OF $(basename "$controller") ---"
        echo ""
    done
fi

echo ""
echo "📊 MODELS:"
echo "---------"
if [ -d "$LARAVEL_ROOT/app/Models" ]; then
    echo "Model files found:"
    find "$LARAVEL_ROOT/app/Models" -name "*.php" -type f
    echo ""
    
    # Show content of all models
    find "$LARAVEL_ROOT/app/Models" -name "*.php" -type f | while read model; do
        echo "📄 === $(basename "$model") ==="
        cat "$model"
        echo ""
        echo "--- END OF $(basename "$model") ---"
        echo ""
    done
fi

echo ""
echo "🔀 ROUTES:"
echo "---------"
route_files=("$LARAVEL_ROOT/routes/api.php" "$LARAVEL_ROOT/routes/web.php" "$LARAVEL_ROOT/routes/console.php" "$LARAVEL_ROOT/routes/channels.php")

for file in "${route_files[@]}"; do
    if [ -f "$file" ]; then
        echo ""
        echo "📄 === $(basename "$file") ==="
        cat "$file"
    fi
done

echo ""
echo "🛡️ MIDDLEWARE:"
echo "-------------"
if [ -d "$LARAVEL_ROOT/app/Http/Middleware" ]; then
    echo "Middleware files found:"
    find "$LARAVEL_ROOT/app/Http/Middleware" -name "*.php" -type f
    echo ""
    
    # Show content of custom middleware (skip default Laravel ones)
    find "$LARAVEL_ROOT/app/Http/Middleware" -name "*.php" -type f | while read middleware; do
        filename=$(basename "$middleware")
        # Skip common Laravel middleware
        if [[ ! "$filename" =~ ^(Authenticate|RedirectIfAuthenticated|TrustProxies|TrimStrings|ValidateSignature|VerifyCsrfToken|EncryptCookies|PreventRequestsDuringMaintenance|HandleCors|TrustHosts)\.php$ ]]; then
            echo "📄 === $filename ==="
            cat "$middleware"
            echo ""
        fi
    done
fi

echo ""
echo "⚙️ KEY CONFIG FILES:"
echo "-------------------"
key_configs=("$LARAVEL_ROOT/config/app.php" "$LARAVEL_ROOT/config/database.php" "$LARAVEL_ROOT/config/cors.php" "$LARAVEL_ROOT/config/auth.php" "$LARAVEL_ROOT/config/services.php")

for config in "${key_configs[@]}"; do
    if [ -f "$config" ]; then
        echo ""
        echo "📄 === $(basename "$config") ==="
        cat "$config"
    fi
done

echo ""
echo "📚 SERVICE PROVIDERS:"
echo "--------------------"
if [ -d "$LARAVEL_ROOT/app/Providers" ]; then
    echo "Provider files found:"
    find "$LARAVEL_ROOT/app/Providers" -name "*.php" -type f
    echo ""
    
    # Show content of all providers
    find "$LARAVEL_ROOT/app/Providers" -name "*.php" -type f | while read provider; do
        echo "📄 === $(basename "$provider") ==="
        cat "$provider"
        echo ""
    done
fi

echo ""
echo "🧪 TESTS:"
echo "--------"
if [ -d "$LARAVEL_ROOT/tests" ]; then
    echo "Test structure:"
    find "$LARAVEL_ROOT/tests" -name "*.php" -type f
    echo ""
    
    # Show content of test files
    find "$LARAVEL_ROOT/tests" -name "*.php" -type f | head -5 | while read test; do
        echo "📄 === $(basename "$test") ==="
        cat "$test"
        echo ""
    done
fi

echo ""
echo "🔧 ARTISAN COMMANDS:"
echo "-------------------"
if [ -d "$LARAVEL_ROOT/app/Console/Commands" ]; then
    echo "Custom command files found:"
    find "$LARAVEL_ROOT/app/Console/Commands" -name "*.php" -type f
    echo ""
    
    # Show content of custom commands
    find "$LARAVEL_ROOT/app/Console/Commands" -name "*.php" -type f | while read command; do
        echo "📄 === $(basename "$command") ==="
        cat "$command"
        echo ""
    done
fi

echo ""
echo "📦 DOCKER CONFIGURATION:"
echo "------------------------"
if [ -f "docker-compose.yml" ]; then
    echo "📄 === docker-compose.yml ==="
    cat "docker-compose.yml"
fi

if [ -f "Dockerfile" ]; then
    echo ""
    echo "📄 === Dockerfile ==="
    cat "Dockerfile"
fi

if [ -d ".docker" ]; then
    echo ""
    echo "📄 Docker configuration files:"
    find .docker -name "*.conf" -o -name "Dockerfile" -o -name "*.yml" -o -name "*.yaml" | while read dockerfile; do
        echo ""
        echo "📄 === $dockerfile ==="
        cat "$dockerfile"
    done
fi

echo ""
echo "📄 KERNEL & HTTP CONFIGURATION:"
echo "-------------------------------"
if [ -f "$LARAVEL_ROOT/app/Http/Kernel.php" ]; then
    echo "📄 === Kernel.php ==="
    cat "$LARAVEL_ROOT/app/Http/Kernel.php"
fi

echo ""
echo "🗂️ RESOURCES & VIEWS:"
echo "---------------------"
if [ -d "$LARAVEL_ROOT/resources/views" ]; then
    echo "View files found:"
    find "$LARAVEL_ROOT/resources/views" -name "*.php" -o -name "*.blade.php" | head -10
fi

echo ""
echo "📊 FINAL STATISTICS:"
echo "-------------------"
echo "Controllers: $(find "$LARAVEL_ROOT/app/Http/Controllers" -name "*.php" 2>/dev/null | wc -l)"
echo "Models: $(find "$LARAVEL_ROOT/app/Models" -name "*.php" 2>/dev/null | wc -l)"
echo "Migrations: $(find "$LARAVEL_ROOT/database/migrations" -name "*.php" 2>/dev/null | wc -l)"
echo "Middleware: $(find "$LARAVEL_ROOT/app/Http/Middleware" -name "*.php" 2>/dev/null | wc -l)"
echo "Service Providers: $(find "$LARAVEL_ROOT/app/Providers" -name "*.php" 2>/dev/null | wc -l)"
echo "Tests: $(find "$LARAVEL_ROOT/tests" -name "*.php" 2>/dev/null | wc -l)"

echo ""
echo "================================="
echo "✅ DEEP CONTENT SCAN COMPLETE"
echo "================================="
echo ""
echo "🎯 NOW PASTE THIS TO CLAUDE FOR DETAILED ANALYSIS"
echo "Claude can now see your actual Laravel code structure!"
echo "================================="