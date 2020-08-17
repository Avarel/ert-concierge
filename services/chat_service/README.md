# ERT / Chat Service

Simple reference implementation of a reactive chat service.

## Dependencies

### With Pipenv (recommended)

This command will install the files using the Pipfile.

``` bash
pipenv install
```

### Without Pipenv

This command will install the dependencies required globally.

``` bash
python3 -m pip install websockets asyncio requests
```

## Running the Service

### With Pipenv (recommended)

``` bash
pipenv run python3 chat_bot.py [optional server address]
```

### Without Pipenv

You must have `websockets`  `asyncio`  `requests` installed as global packages to proceed.

``` bash
python3 chat_service.py [optional server address]
```