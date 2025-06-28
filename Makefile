up:
	@docker compose --env-file .env.prod up -d --build

down:
	@docker compose --env-file .env.prod down

start:
	@docker compose --env-file .env.prod start

stop:
	@docker compose --env-file .env.prod stop

restart:
	@docker compose --env-file .env.prod restart
