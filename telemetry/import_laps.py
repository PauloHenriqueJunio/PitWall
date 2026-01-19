import fastf1
import requests
import pandas as pd

API_URL = "http://localhost:3000"

YEAR = 2025;
RACE_LOCATION = 'Bahrain Grand Prix'

fastf1.Cache.enable_cache('cache');

print("Sessão para importar")
print("1 para corrida");
print("2 para qualy");
option = input("Digite um número: ");

session_code = 'R' if option == '1' else 'Q';
session_label = 'RACE' if option == '1' else 'QUALY';

print(f"Carregando dados de {session_label}...");

session = fastf1.get_session(YEAR, RACE_LOCATION, session_code);
session.load();

print("\n🔍 Buscando dados do backend...");

try:
    response = requests.get(f"{API_URL}/drivers")
    db_drivers = response.json();
    driver_map = {str(d['number']): d['id'] for d in db_drivers}
    print(f"{len(driver_map)} pilotos encontrados.");
except Exception as e:
    print(f"ERRO ao buscar pilotos: {e}");
    exit();

try:
    response_races = requests.get(f"{API_URL}/races")
    db_races = response_races.json();
    print(f"{len(db_races)} corridas encontradas.");
except Exception as e:
    print(f"ERRO ao buscar corridas: {e}");
    exit();

try:
    current_race = next((r for r in db_races if RACE_LOCATION in r['name']), None);
    if not current_race:
        print(f"ERRO: corrida '{RACE_LOCATION}' não encontrada no banco");
        print("   Corridas disponíveis:");
        for r in db_races:
            print(f"      - {r['name']}")
        exit();
    print(f"Vinculando à corrida: {current_race['name']} (ID: {current_race['id']})");
except Exception as e:
    print(f"ERRO ao procurar corrida: {e}");
    exit();

print("Processando voltas...");
laps = session.laps

count = 0

for index, lap in laps.iterlaps():
    driver_number = str(lap['DriverNumber']);

    if driver_number in driver_map:
        db_driver_id = driver_map[driver_number];

        if pd.isna(lap['LapTime']):
            continue;

        lap_time_str = str(lap['LapTime']).split('days ')[-1]

        payload = {
            "lap_number": int(lap['LapNumber']),
            "position": int(lap['Position']) if not pd.isna(lap['Position']) else 0,
            "time": lap_time_str,
            "sector_1": lap['Sector1Time'].total_seconds() if not pd.isna(lap['Sector1Time']) else 0,
            "sector_2": lap['Sector2Time'].total_seconds() if not pd.isna(lap['Sector2Time']) else 0,
            "sector_3": lap['Sector3Time'].total_seconds() if not pd.isna(lap['Sector3Time']) else 0,
            "session_type": session_label,
            "driver": {"id": db_driver_id },
            "race": {"id": current_race['id']}
        }

        try: 
            r = requests.post(f"{API_URL}/laps", json=payload)
            if r.status_code == 201:
                count += 1
                if count % 50 == 0:
                    print (f"{count} voltas importadas...");

        except:
            print(f"Falha ao enviar volta{lap['LapNumber']} do piloto {driver_number}")
print(f"\nTotal de {count} voltas importadas.")