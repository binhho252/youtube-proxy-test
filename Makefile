# Makefile
.PHONY: install build start test clean logs report

install:
	npm install

build:
	docker-compose build

start:
	docker-compose up -d

stop:
	docker-compose down

logs:
	docker-compose logs -f

test: start
	@echo "Running concurrent test..."
	@chmod +x ./src/scripts/test-concurrent.sh
	./src/scripts/test-concurrent.sh

report:
	@echo "Generating test report..."
	npx ts-node src/scripts/generate-report.ts

clean:
	docker-compose down -v
	rm -rf node_modules
	rm -f test_results.log

# Development commands
dev:
	npm run start:dev

migration-generate:
	npm run typeorm:generate-migration

migration-run:
	npm run typeorm:run-migration

# Default
all: install build start