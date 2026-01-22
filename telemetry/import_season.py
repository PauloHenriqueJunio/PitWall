import fastf1;
import requests;
import pandas as pd;
import warnings;
import time;
import os;
from concurrent.futures import ThreadPoolExecutor, as_completed;
from threading import Lock;


API_URL = "https://pitwall-production.up.railway.app";
DATA_YEAR = 2025;
MAX_WORKERS = 5;
fastf1.Cache.enable_cache('cache');
warnings.simplefilter(action='ignore', category=FutureWarning)


print_lock = Lock();


def get_db_data(endpoint):
    try:
        response = requests.get(f"{API_URL}/{endpoint}")
        return response.json();
    except:
        print(f"ERRO ao buscar {endpoint}");
        exit();

def send_lap(payload, lap_number, driver_number):
    for tentativa in range(3):
        try:
            time.sleep(0.1)
            resp = requests.post(f"{API_URL}/laps", json=payload, timeout=10)
            
            if resp.status_code in [200, 201]:
                return True, lap_number, driver_number
            else:
                time.sleep(1)
        except Exception as e:
            if tentativa == 2:
                with print_lock:
                    print(f"Falha ao enviar volta {lap_number} do piloto {driver_number}")
            time.sleep(2)
    
    return False, lap_number, driver_number

def import_session(race_db, session_type, driver_map):
    f1_session_type = 'R' if session_type == 'RACE' else 'Q'

    print(f"Baixando {session_type} - {race_db['name']}");

    try:
        session = fastf1.get_session(DATA_YEAR, race_db['name'], f1_session_type);
        session.load(weather=False, messages=False, telemetry=False);
    except Exception as e:
        print(f"Dados não localizados no fastf1 para a corrida de 2025: {e}");
        return;

    laps = session.laps;
    
    payloads = []
    for index, lap in laps.iterlaps():
        driver_number = str(lap['DriverNumber']);

        if driver_number in driver_map:

            lap_time_str = "00:00.000" if pd.isna(lap['LapTime']) else str(lap['LapTime']).split(' ')[-1];

            payload = {
                "lap_number": int(lap['LapNumber']),
                "position": int(lap['Position']) if not pd.isna(lap['Position']) else 0,
                "time": lap_time_str,
                "session_type": session_type,
                "driver": {"id": driver_map[driver_number]},
                "race": {"id": race_db['id']}
            };
            
            payloads.append((payload, int(lap['LapNumber']), driver_number))
    
    # Envia voltas em paralelo
    count_success = 0
    count_failed = 0
    
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(send_lap, p[0], p[1], p[2]): p for p in payloads}
        
        for future in as_completed(futures):
            success, lap_num, driver_num = future.result()
            if success:
                count_success += 1
                if count_success % 50 == 0:  # Mostra progresso a cada 50 voltas
                    with print_lock:
                        print(f"   ✓ {count_success}/{len(payloads)} voltas enviadas...")
            else:
                count_failed += 1
        
    print(f"{count_success} voltas importadas | {count_failed} falharam");


print("="*50);
print(f"Temporada importada da f1: {DATA_YEAR}")
print("="*50)

print("Carregando pilotos...");
db_drivers = get_db_data("drivers");
driver_map = {str(d['number']): d['id'] for d in db_drivers}
print(f"{len(driver_map)} pilotos encontrados.");

print("Carregando o calendário");
db_races = get_db_data("races")
print(f"{len(db_races)} corridas encontradas.")

print("\n Iniciando importação das sessões, pode demorar um pouco.\n");

filter_race_id = os.getenv('RACE_ID')

for i, race in enumerate(db_races):
    if filter_race_id and str(race['id']) != str(filter_race_id):
        continue

    print(f"\n[{i+1}/{len(db_races)}] Processando: {race['name']}")
    import_session(race, 'QUALY', driver_map)
    import_session(race, 'RACE', driver_map)

print("\n" + "="*50)
print("Processo concluído com sucesso")