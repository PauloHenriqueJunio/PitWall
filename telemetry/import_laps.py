import fastf1
import requests
import pandas as pd

API_URL = "http://localhost:3000"

fastf1.Cache.enable_cache('cache');

print(f"Carregando dados de voltas...");

session = fastf1.get_session(2025, 'Bahrain', 'Q');
session.load();

try:

    response = requests.get(f"{API_URL}/drivers")
    db_drivers = response.json();
    driver_map = {str(d['number']): d['id'] for d in db_drivers}
    print(f"Mapeados {len(driver_map)} pilotos do banco de dados.");
except Exception as e:
    print("Erro ao buscar pilotos do backend!");
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
            "driver": {"id": db_driver_id }
        }

        try: 
            r = requests.post(f"{API_URL}/laps", json=payload)
            if r.status_code == 201:
                count += 1
                if count % 10 == 0:
                    print (f"{count} voltas importadas...");

        except:
            print(f"Falha ao enviar volta{lap['LapNumber']} do piloto {driver_number}")
print(f"\nTotal de {count} voltas importadas.")