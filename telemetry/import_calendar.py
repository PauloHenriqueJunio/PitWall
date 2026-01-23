import fastf1 
import requests
import os

API_URL = os.getenv("API_URL", "http://localhost:3000/races");

YEAR = 2025;

schedule = fastf1.get_event_schedule(YEAR);

count = 0 
for i, row in schedule.iterrows():
    if row['EventFormat'] == 'testing' or int(row['RoundNumber']) <= 0:
        print(f"Ignorando: {row['EventName']} (Round {row['RoundNumber']})")
        continue
    
    try:
        payload = {
            "name": row['EventName'],
            "round": int(row['RoundNumber']),
            "location": row['Location'],
            "date": str(row['EventDate']).split(' ')[0],
            "year": int(row['EventDate'].year)
        }

        response = requests.post(f"{API_URL}/races", json=payload);

        if response.status_code == 201:
            print(f"{row['EventName']} adicionada!")

            count += 1;

        else:
            print("Erro ao adicionar corrida:", response.text);


    except Exception as e:
            print(f"Erro: {e}")
        
print(f"{count} corridas adicionadas no total.")
