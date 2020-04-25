start:
	docker-compose up -d

stop:
	docker-compose stop

down:
	docker-compose down

build:
	docker build -t rafaelpsantos/ola-adeus-back -f Dockerfile.dev . --build-arg REDIS_HOST='172.21.0.2'

test:
	docker run -e PORT=3000 -e SESSION_SECRET='password' -e REDIS_HOST='172.21.0.2' -e REDIS_PORT=6379 -e MONGO_HOST='172.17.0.3' -e MONGO_PORT=27017 rafaelpsantos/ola-adeus-back npm test -- --coverage