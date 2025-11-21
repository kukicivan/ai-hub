#!/bin/bash

# Repository Structure Scanner
# Generates a complete overview of repository structure for analysis

echo "🔍 REPOSITORY STRUCTURE SCAN"
echo "================================="
echo "Scanned on: $(date)"
echo "Directory: $(pwd)"
echo "================================="

echo ""
echo "📁 DIRECTORY TREE STRUCTURE:"
echo "----------------------------"
# Show directory tree (limit depth to avoid overwhelming output)
if command -v tree >/dev/null 2>&1; then
    tree -a -L 4 -I 'node_modules|.git|dist|build|coverage|.next|out'
else
    # Fallback if tree is not available
    find . -type d \( -name node_modules -o -name .git -o -name dist -o -name build -o -name coverage -o -name .next -o -name out \) -prune -o -type d -print | head -50 | sort
fi

echo ""
echo "📋 PACKAGE.JSON CONTENT:"
echo "------------------------"
if [ -f "package.json" ]; then
    cat package.json
else
    echo "❌ package.json not found"
fi

echo ""
echo "🔧 CONFIGURATION FILES:"
echo "-----------------------"
config_files=("tsconfig.json" "webpack.config.js" "vite.config.js" "next.config.js" "tailwind.config.js" ".env.example" ".env.local" ".gitignore" "README.md" "craco.config.js" "babel.config.js" ".eslintrc.js" ".eslintrc.json" "prettier.config.js")

for file in "${config_files[@]}"; do
    if [ -f "$file" ]; then
        echo ""
        echo "📄 === $file ==="
        cat "$file"
    fi
done

echo ""
echo "📂 SOURCE CODE STRUCTURE:"
echo "-------------------------"
if [ -d "src" ]; then
    echo "SRC directory contents:"
    find src -type f -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.css" -o -name "*.scss" | head -30 | while read file; do
        echo "  📄 $file"
    done
fi

echo ""
echo "🏗️ KEY APPLICATION FILES:"
echo "-------------------------"
key_files=("src/App.js" "src/App.jsx" "src/App.ts" "src/App.tsx" "src/index.js" "src/index.jsx" "src/index.ts" "src/index.tsx" "src/main.js" "src/main.jsx" "src/main.ts" "src/main.tsx")

for file in "${key_files[@]}"; do
    if [ -f "$file" ]; then
        echo ""
        echo "📄 === $file ==="
        head -50 "$file"
    fi
done

echo ""
echo "📊 FILE STATISTICS:"
echo "------------------"
if [ -d "src" ]; then
    echo "JavaScript files: $(find src -name "*.js" | wc -l)"
    echo "JSX files: $(find src -name "*.jsx" | wc -l)"
    echo "TypeScript files: $(find src -name "*.ts" | wc -l)"
    echo "TSX files: $(find src -name "*.tsx" | wc -l)"
    echo "CSS files: $(find src -name "*.css" | wc -l)"
    echo "SCSS files: $(find src -name "*.scss" | wc -l)"
    echo "JSON files: $(find src -name "*.json" | wc -l)"
fi

echo ""
echo "🔍 IMPORTANT DIRECTORIES:"
echo "------------------------"
important_dirs=("src/components" "src/pages" "src/views" "src/screens" "src/services" "src/api" "src/utils" "src/helpers" "src/hooks" "src/store" "src/context" "src/styles" "src/assets" "public")

for dir in "${important_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo ""
        echo "📂 $dir contents:"
        ls -la "$dir" | head -10
        echo "   File count: $(find "$dir" -type f | wc -l)"
    fi
done

echo ""
echo "🧪 TEST FILES:"
echo "-------------"
test_files=$(find . -name "*.test.*" -o -name "*.spec.*" | grep -v node_modules | head -10)
if [ -n "$test_files" ]; then
    echo "$test_files"
else
    echo "No test files found"
fi

echo ""
echo "📝 DOCUMENTATION FILES:"
echo "----------------------"
doc_files=$(find . -maxdepth 2 -name "*.md" | grep -v node_modules)
if [ -n "$doc_files" ]; then
    echo "$doc_files" | while read file; do
        echo ""
        echo "📄 === $file ==="
        head -20 "$file"
    done
else
    echo "No documentation files found"
fi

echo ""
echo "🔧 BUILD/DEPLOYMENT FILES:"
echo "--------------------------"
build_files=("Dockerfile" "docker-compose.yml" ".github/workflows" "vercel.json" "netlify.toml" ".travis.yml" ".circleci/config.yml")

for file in "${build_files[@]}"; do
    if [ -f "$file" ] || [ -d "$file" ]; then
        echo "✅ $file exists"
        if [ -f "$file" ]; then
            echo "Content preview:"
            head -15 "$file"
        elif [ -d "$file" ]; then
            echo "Directory contents:"
            ls -la "$file"
        fi
        echo ""
    fi
done

echo ""
echo "================================="
echo "✅ REPOSITORY SCAN COMPLETE"
echo "================================="
echo ""
echo "🎯 PASTE THIS OUTPUT TO CLAUDE FOR ANALYSIS"
echo "Claude will identify key files and development insights!"
echo "================================="