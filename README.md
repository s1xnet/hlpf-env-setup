\# Практичне заняття 1: Підготовка середовища для розробки



\## Student



\* Name: Лукянова Ю. А.

\* Group: 232.1



\## Опис роботи



У межах практичного заняття було підготовлено середовище для подальшої розробки. Було встановлено та перевірено Docker Desktop, Docker Compose, Git, створено GitHub-репозиторій, а також додано базовий Dockerfile і docker-compose.yml для запуску контейнера з актуальною версією npm.



\## Перевірка Docker, Docker Compose та Git



```text

docker --version

Docker version 29.5.3, build d1c06ef



docker compose version

Docker Compose version v5.1.4



git --version

git version 2.54.0.windows.1

```



\## Перевірка роботи Docker



```text

docker run --rm hello-world



Hello from Docker!

This message shows that your installation appears to be working correctly.

```



\## Перевірка docker-compose та latest npm



```text

docker compose up --build



Image hlpf-env-setup-npm Built

Network hlpf-env-setup\_default Created

Container hlpf-env-setup-npm-1 Created

npm-1 | 11.17.0

npm-1 exited with code 0

```



\## Перевірка версії npm



```text

docker compose run --rm npm npm -v



11.17.0

```



\## Перевірка версії Node.js



```text

docker compose run --rm npm node --version



v26.3.1

```



\## Repository structure



```text

Dockerfile

docker-compose.yml

README.md

```



\## Висновок



Під час виконання практичного заняття було підготовлено базове середовище для розробки. Docker Desktop і Docker Compose успішно встановлено та перевірено. Команда hello-world підтвердила, що Docker працює коректно. Також було створено GitHub-репозиторій, додано Dockerfile і docker-compose.yml, після чого через Docker Compose успішно перевірено версії npm та Node.js.



