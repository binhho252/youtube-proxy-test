.PHONY: test generate-urls 

# Generate URLs
generate-urls:
	@chmod +x src/scripts/generate-test-urls.sh
	@./src/scripts/generate-test-urls.sh

# Chạy test
test: generate-urls
	@chmod +x src/scripts/test-concurrent.sh
	@./src/scripts/test-concurrent.sh

# Generate báo cáo chi tiết
report:
	@python3 src/scripts/generate-detailed-report.py

# Phân tích lỗi
analyze-errors:
	@python3 src/scripts/error-analysis.py