#!/bin/bash

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Print the current working directory
# echo "Current working directory: $(pwd)"

# Function to find the 'vector/src' directory starting from the current directory and moving up
find_vector_src() {
  local dir=$PWD
  while [ "$dir" != "/" ]; do
    if [ -d "$dir/vector/src" ]; then
      echo "$dir/vector/src"
      return 0
    fi
    dir=$(dirname "$dir")
  done
  return 1
}

# Find the absolute path to the 'vector/src' directory
vector_src_path=$(find_vector_src)

if [ -z "$vector_src_path" ]; then
  echo "Error: 'vector/src' directory not found."
  exit 1
fi

echo -e "${YELLOW}Converting vector imports to external package format...${NC}"
echo -e "${YELLOW}Expected format: from \"../vector/src\"${NC}"
echo -e "${YELLOW}Converting to: from \"@kurtbruns/vector\"${NC}"
echo

# Print the found vector/src path
# echo "Found vector/src directory: $vector_src_path"

# Function to compute relative path
compute_relative_path() {
  local source=$(cd "$1"; pwd)
  local target=$(cd "$2"; pwd)
  local common_part=$source
  local result=""
  
  while [[ "${target#$common_part}" == "${target}" ]]; do
    common_part=$(dirname "$common_part")
    result="../$result"
  done
  
  local forward_part=${target#$common_part/}
  echo "$result$forward_part"
}

# Find all .ts files and replace the import statements
find . -type f -name "*.ts" ! -path "*/node_modules/*" | while read -r file; do
  file_dir=$(dirname "$file")
  relative_path=$(compute_relative_path "$file_dir" "$vector_src_path")
  old_import=$(grep -E "import \{([^}]+)\} from ['\"].*vector/src.*" "$file")
  if [[ -n "$old_import" ]]; then

    # Check for problematic imports that don't end with "vector/src"
    problematic_imports=$(grep -n -E "import \{([^}]+)\} from ['\"].*vector/src[^'\"]*['\"]" "$file" | grep -v -E "from ['\"][^'\"]*vector/src['\"]")
    if [[ -n "$problematic_imports" ]]; then
      echo -e "${RED}⚠️  WARNING: Found problematic imports in: ${file}${NC}"
      echo "$problematic_imports" | while read -r line; do
        echo -e "  ${YELLOW}Line ${line}${NC}"
      done
      echo -e "${YELLOW}Expected format: from \"../vector/src\"${NC}"
      echo -e "${YELLOW}Problematic format: from \"../vector/src/quaternions/QObject\"${NC}"
      echo
    fi

    # Uncomment the following lines for testing
    # new_import=$(echo "$old_import" | sed "s|from ['\"].*vector/src.*|from '@kurtbruns/vector';|g")
    # echo "File: $file"
    # echo "Old Import: $old_import"
    # echo "New Import: $new_import"
    # echo

    # Uncomment the following line to actually perform the replacement
    sed -i '' -E "s|import \{([^}]+)\} from ['\"].*vector/src.*|import {\1} from '@kurtbruns/vector';|g" "$file"

    # Print the file that had its imports replaced
    echo -e "${GREEN}Replaced imports in: $file${NC}"
  fi
done

echo -e "${GREEN}Replacement complete.${NC}"
