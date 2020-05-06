start:
	docker-compose up -d

stop:
	docker-compose stop

down:
	docker-compose down

build:
	docker build -t rafaelpsantos/ola-adeus-back -f Dockerfile.dev . --build-arg REDIS_HOST='172.21.0.2'

test:
	docker run --network="host" -e PORT=3000 -e SESSION_SECRET='password' -e REDIS_HOST='localhost' -e REDIS_PORT=6379 -e MONGO_HOST='localhost' -e MONGO_PORT=27017 rafaelpsantos/ola-adeus-back npm test -- --coverage