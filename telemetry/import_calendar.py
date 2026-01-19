import fastf1 
import requests

API_URL = "http://localhost:3000/races";

YEAR = 2025;

schedule = fastf1.get_event_schedule(YEAR);

count = 0 
for i, row in schedule.iterrows():
    try:
        payload = {
            "name": row['EventName'],
            "round": int(row['RoundNumber']),
            "location": row['Location'],
            "date": str(row['EventDate']).split(' ')[0],
            "year": int(row['EventDate'].year)
        }

        response = requests.post(API_URL, json=payload);

        if response.status_code == 201:
            print(f"{row['EventName']} adicionada!")

            count += 1;

        else:
            print("Erro ao adicionar corrida:", response.text);


    except Exception as e:
            print(f"Erro: {e}")
        
print(f"{count} corridas adicionadas no total.")
