import fastf1
import requests
import os

API_URL = os.getenv("API_URL", "http://localhost:3000/drivers");
fastf1.Cache.enable_cache('cache')

DRIVER_COUNTRIES = {
    1: "NED",
    2: "USA",
    4: "GBR",
    10: "FRA",
    11: "MEX",
    14: "ESP",
    16: "MON",
    18: "CAN",
    20: "CHN",
    22: "JPN",
    23: "THA",
    24: "CHN",
    27: "AUS",
    31: "FRA",
    38: "AUS",
    43: "ARG",
    44: "GBR",
    55: "ESP",
    63: "GBR",
    81: "AUS",
    87: "ITA",
}

all_drivers = {}


races = ['Bahrain', 'Saudi Arabia', 'Las Vegas', 'Abu Dhabi']

for race in races:
    try:
        print(f'Carregando pilotos de {race}...')
        session = fastf1.get_session(2025, race, 'Q')
        session.load()
        
        for number in session.drivers:
            d = session.get_driver(number)
            driver_num = int(d["DriverNumber"])

            if driver_num not in all_drivers:
                all_drivers[driver_num] = {
                    "name": d["FullName"],
                    "team": d["TeamName"],
                    "number": driver_num,
                    "country": DRIVER_COUNTRIES.get(driver_num, "UNK"),
                    "abbr": d["Abbreviation"],
                }
    except Exception as e:
        print(f'Erro ao carregar {race}: {e}')

print(f'\nEncontrados {len(all_drivers)} pilotos únicos. Importando...')

for payload in all_drivers.values():
    abbr = payload.pop('abbr')
    try:
        response = requests.post(f"{API_URL}/drivers", json=payload)
        if response.status_code == 201:
            print(f'Piloto {abbr} importado com sucesso!')
        else:
            print(f'Erro ao importar piloto {abbr}: {response.text}')
    except Exception as e:
        print(f'Erro de conexão: {e}')

print("\nImportação finalizada!")
