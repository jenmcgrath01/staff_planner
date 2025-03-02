#!/bin/bash

# List of files to remove
files=(
    "src/App 2.tsx"
    "src/main 2.tsx"
    "src/vite-env.d 2.ts"
    "src/components/Header.tsx"
    "src/components/layout/Header.tsx"
    "src/components/staff/StaffView.tsx"
    "src/components/schedule/CapacityWidget.tsx"
    "src/types/index 2.ts"
)

# Function to remove file and report status
remove_file() {
    local file="$1"
    if [ -f "$file" ]; then
        rm "$file"
        echo "✓ Removed: $file"
    else
        echo "⚠ Not found: $file"
    fi
}

echo "Starting cleanup..."
echo "==================="

# Remove each file
for file in "${files[@]}"; do
    remove_file "$file"
done

echo "==================="
echo "Cleanup complete!" 