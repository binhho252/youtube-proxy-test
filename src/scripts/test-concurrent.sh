#!/bin/bash
# src/scripts/test-concurrent.sh

URLS_FILE="video_urls.txt"
CONCURRENT_REQUESTS=50  # Điều chỉnh số lượng concurrent
OUTPUT_DIR="test_results_$(date +%Y%m%d_%H%M%S)"
SUMMARY_FILE="${OUTPUT_DIR}/summary.json"

mkdir -p $OUTPUT_DIR

# Hàm thực hiện request
make_request() {
    local url=$1
    local output_file=$2
    
    # Gọi API endpoint của service
    curl -s -X POST \
         -H "Content-Type: application/json" \
         -d "{\"url\": \"$url\"}" \
         http://localhost:3000/api/youtube/info \
         -o "$output_file" \
         -w "%{http_code}" 2>&1
}

export -f make_request
export OUTPUT_DIR

# Parallel processing
cat $URLS_FILE | parallel -j$CONCURRENT_REQUESTS \
    'make_request {} "$OUTPUT_DIR/{#}.json"'

# Generate summary report
python3 - << END
import os
import json

output_dir = os.environ['OUTPUT_DIR']
results = {
    'total_requests': 0,
    'successful_requests': 0,
    'failed_requests': 0,
    'errors': {}
}

for filename in os.listdir(output_dir):
    if filename.endswith('.json'):
        results['total_requests'] += 1
        file_path = os.path.join(output_dir, filename)
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
                results['successful_requests'] += 1
        except json.JSONDecodeError as e:
            results['failed_requests'] += 1
            error_type = type(e).__name__
            results['errors'][error_type] = results['errors'].get(error_type, 0) + 1

with open('$SUMMARY_FILE', 'w') as f:
    json.dump(results, f, indent=2)

print(json.dumps(results, indent=2))
END

echo "Test completed. Results in $SUMMARY_FILE"