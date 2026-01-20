import requests

API_URL = "http://localhost:3000"

payload = {
    "name": "Franco Colapinto",
    "team": "Alpine",
    "number": 43,
    "country": "ARG"
}

try:
    response = requests.post(f"{API_URL}/drivers", json=payload)
    if response.status_code == 201:
        print("Franco Colapinto cadastrado com sucesso")
        print(f"ID no Banco: {response.json()['id']}")
    else:
        print(f"erro: {response.text}")
except Exception as e:
    print(f"erro de conexão: {e}")