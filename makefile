build:
	docker build -t rafaelpsantos/ola-adeus-back:latest .

run:
	docker run -p 3001:3000 -d rafaelpsantos/ola-adeus-back:latest

start:
	npm start