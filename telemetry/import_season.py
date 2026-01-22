import fastf1;
import requests;
import pandas as pd;
import warnings;
import time;


API_URL = "https://pitwall-production.up.railway.app";
DATA_YEAR = 2025;
fastf1.Cache.enable_cache('cache');
warnings.simplefilter(action='ignore', category=FutureWarning)


def get_db_data(endpoint):
    try:
        response = requests.get(f"{API_URL}/{endpoint}")
        return response.json();
    except:
        print(f"ERRO ao buscar {endpoint}");
        exit();

def import_session(race_db, session_type, driver_map):
    f1_session_type = 'R' if session_type == 'RACE' else 'Q'

    print(f"Baixando {session_type}");

    try:
        session = fastf1.get_session(DATA_YEAR, race_db['name'], f1_session_type);
        session.load(weather=False, messages=False, telemetry=False);
    except Exception as e:
        print(f"Dados nao localizados no fasf1 para a corrida de 2025 {e}");
        return;

    laps = session.laps;
    count = 0;

    for index, lap in laps.iterlaps():
        driver_number = str(lap['DriverNumber']);

        if driver_number in driver_map:
            if pd.isna(lap['LapTime']): continue;

            lap_time_str = str(lap['LapTime']).split(' ')[-1];

            payload = {
                "lap_number": int(lap['LapNumber']),
                    "position": int(lap['Position']) if not pd.isna(lap['Position']) else 0,
                    "time": lap_time_str,
                    "session_type": session_type,
                    "driver": {"id": driver_map[driver_number]},
                    "race": {"id": race_db['id']}
            };

            sucess = False
            tentativas = 0
            while not sucess and tentativas < 3:
                try:
                    time.sleep(0.2)
                    
                    resp = requests.post(f"{API_URL}/laps", json=payload)
                    
                    
                    if resp.status_code in [200, 201]:
                        count += 1
                        sucess = True
                        print(f"[Volta {int(lap['LapNumber'])}] Salva! Volta do piloto: {lap['DriverNumber']} (Total importado: {count})", flush=True)
                    else:
                        tentativas += 1
                        time.sleep(2) 

                except Exception as e:
                    tentativas += 1
                    print(f"\nConexão caiu. Tentando de novo ({tentativas}/3)...")
                    time.sleep(5)
        
    print(f"Sucesso {count} voltas importadas");

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

for i, race in enumerate(db_races):
    print(f"\n[{i+1}/{len(db_races)}] Processando: {race['name']}")
    import_session(race, 'QUALY', driver_map)
    import_session(race, 'RACE', driver_map)

print("\n" + "="*50)
print("Processo concluído com sucesso")