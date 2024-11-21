#!/bin/bash
# src/scripts/generate-test-urls.sh
# Generate 1000 random YouTube video URLs

# Danh sách các nguồn URL (có thể mở rộng)
SOURCES=(
  "https://www.youtube.com/playlist?list=PLX2HkOoQkP4uKPXQhV3MkNMcUNS5aO-xUC"  # Trending
  "https://www.youtube.com/playlist?list=PL4cUxeGkcC9iGstQ1Y_4k2wf-SHHMVk_b"  # Popular Music
  # Thêm các playlist khác
)

# Tạo file URLs
generate_urls() {
  local count=0
  for source in "${SOURCES[@]}"; do
    # Fetch URLs từ playlist
    youtube-dl -i --get-id "$source" | while read -r video_id; do
      echo "https://www.youtube.com/watch?v=$video_id"
      ((count++))
      if [ $count -ge 1000 ]; then
        break 2
      fi
    done
  done
}

generate_urls > video_urls.txt
echo "Generated 1000 URLs in video_urls.txt"