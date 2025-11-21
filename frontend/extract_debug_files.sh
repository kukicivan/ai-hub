#!/bin/bash

# Extract Debug Files for Environment Configuration
# Usage: ./extract-debug-files.sh

echo "🔍 EXTRACTING FILES FOR ENVIRONMENT DEBUG"
echo "========================================="
echo "Date: $(date)"
echo "Directory: $(pwd)"
echo "========================================="

# Create output file
OUTPUT_FILE="debug-files-output.txt"
echo "📝 Creating output file: $OUTPUT_FILE"
echo "" > "$OUTPUT_FILE"

# Function to safely display file content
display_file() {
    local file_path="$1"
    local file_name=$(basename "$file_path")
    
    echo ""
    echo "📄 === $file_path ===" | tee -a "$OUTPUT_FILE"
    
    if [[ -f "$file_path" ]]; then
        echo "✅ File exists" | tee -a "$OUTPUT_FILE"
        echo "File size: $(wc -c < "$file_path") bytes" | tee -a "$OUTPUT_FILE"
        echo "--- Content ---" | tee -a "$OUTPUT_FILE"
        cat "$file_path" | tee -a "$OUTPUT_FILE"
        echo "--- End of $file_name ---" | tee -a "$OUTPUT_FILE"
    else
        echo "❌ File not found: $file_path" | tee -a "$OUTPUT_FILE"
        
        # Try to find similar files
        local dir_name=$(dirname "$file_path")
        local base_name=$(basename "$file_path")
        
        if [[ -d "$dir_name" ]]; then
            echo "📁 Files in $dir_name directory:" | tee -a "$OUTPUT_FILE"
            ls -la "$dir_name" 2>/dev/null | head -10 | tee -a "$OUTPUT_FILE"
        fi
    fi
    echo "" | tee -a "$OUTPUT_FILE"
}

echo ""
echo "🔧 ENVIRONMENT CONFIGURATION FILES"
echo "=================================="

# Environment files
display_file ".env"
display_file ".env.docker"
display_file ".env.example"
display_file ".env.production"

echo ""
echo "⚙️ API CONFIGURATION FILES"
echo "=========================="

# API configuration files
display_file "src/redux/api/baseApi.ts"
display_file "src/redux/features/auth/authApi.ts"

echo ""
echo "🛠️ BUILD CONFIGURATION FILES"
echo "============================"

# Vite configuration
display_file "vite.config.ts"

echo ""
echo "🐳 DOCKER CONFIGURATION FILES"
echo "============================="

# Docker files
display_file "docker-compose.yml"
display_file ".docker/frontend/Dockerfile"

echo ""
echo "🔐 AUTHENTICATION FILES"
echo "======================="

# Authentication components
display_file "src/pages/Login.tsx"
display_file "src/components/login-form.tsx"

echo ""
echo "📦 PACKAGE CONFIGURATION"
echo "========================"

# Package.json for scripts and dependencies
display_file "package.json"

echo ""
echo "🎯 ADDITIONAL HELPFUL FILES"
echo "==========================="

# Check for other relevant config files
display_file "src/config/config.ts"
display_file "src/utils/verifyToken.ts"

echo ""
echo "📊 SUMMARY REPORT"
echo "================="

total_files=0
found_files=0

files_to_check=(
    ".env"
    ".env.docker" 
    ".env.example"
    ".env.production"
    "src/redux/api/baseApi.ts"
    "src/redux/features/auth/authApi.ts"
    "vite.config.ts"
    "docker-compose.yml"
    ".docker/frontend/Dockerfile"
    "src/pages/Login.tsx"
    "src/components/login-form.tsx"
    "package.json"
)

for file in "${files_to_check[@]}"; do
    total_files=$((total_files + 1))
    if [[ -f "$file" ]]; then
        found_files=$((found_files + 1))
        echo "✅ $file" | tee -a "$OUTPUT_FILE"
    else
        echo "❌ $file" | tee -a "$OUTPUT_FILE"
    fi
done

echo "" | tee -a "$OUTPUT_FILE"
echo "📈 Files found: $found_files/$total_files" | tee -a "$OUTPUT_FILE"
echo "" | tee -a "$OUTPUT_FILE"

echo "========================================="
echo "✅ EXTRACTION COMPLETE!"
echo "========================================="
echo ""
echo "📋 Next Steps:"
echo "1. Review the output above"
echo "2. Check the file: $OUTPUT_FILE"
echo "3. Copy the content and send to Claude"
echo ""
echo "🚀 Quick Copy Command:"
echo "cat $OUTPUT_FILE | pbcopy   # macOS"
echo "cat $OUTPUT_FILE | xclip -selection clipboard   # Linux"
echo ""
echo "💡 Or simply: cat $OUTPUT_FILE"
echo ""

# Make the output file readable
chmod 644 "$OUTPUT_FILE" 2>/dev/null

echo "🎯 File saved as: $OUTPUT_FILE"
echo "File size: $(wc -c < "$OUTPUT_FILE" 2>/dev/null || echo 'unknown') bytes"