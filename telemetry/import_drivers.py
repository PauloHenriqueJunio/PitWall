import fastf1
import requests

API_URL = "https://localhost:3000/drivers";

fastf1.Cache.enable_cache('cache');

print("Carregando dados da Bahrain 2024...");
session = fastf1.get_session(2024, 'Bahrain', 'Q');
session.load();

drivers_numbers = session.drivers;


print(f'Encontrados {len(drivers_numbers)} pilotos. Importando...');

for numbers in drivers_numbers:
    d = session.get_driver(numbers);
    
    payload = {
        "name": d['FullName'],
        "team": d['TeamName'],
        "number": int(d['DriverNumber']),
        "country": d['CountryCode']
    }

    try:
        response = requests.post(API_URL, json=payload);

        if response.status_code == 201:
            print(f'Piloto {d['Abbreviation']} importado com sucesso!');
        else:
            print(f'Erro ao importar piloto {d['Abbreviation']}: {response.text}');

    except Exception as e:
        print(f"Erro de conexão!");

print("\nImportação finalizada!");


    


