import fastf1

fastf1.Cache.enable_cache('cache');

print("Carregando dados da Bahrain 2024...");

session = fastf1.get_session(2024, 'Bahrain', 'Q');
session.load();

fastest_lap = session.laps.pick_fastest();

print("\nVolta mais rápida:")
print(f"Piloto: {fastest_lap['Driver']}")
print(f"Time: {fastest_lap['Team']}")
print(f"Tempo: {fastest_lap['LapTime']}")
print(f"Velocidade máxima: {fastest_lap['SpeedST']} km/h")

