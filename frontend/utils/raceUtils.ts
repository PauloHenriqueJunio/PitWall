export const parseLapTimeToSeconds = (time: string | undefined): number => {
  if (!time) return Infinity;

  const cleanTime = time.replace("0 days ", "").trim();

  try {
    const parts = cleanTime.split(":");
    let seconds = 0;

    if (parts.length === 3) {
      seconds += parseInt(parts[0]) * 3600;
      seconds += parseInt(parts[1]) * 60;
      seconds += parseFloat(parts[2]);
    } else if (parts.length === 2) {
      seconds += parseInt(parts[0]) * 60;
      seconds += parseFloat(parts[1]);
    } else {
      return Infinity;
    }

    if (Number.isNaN(seconds) || seconds <= 0) {
      return Infinity;
    }

    return seconds;
  } catch (e) {
    return Infinity;
  }
};

export const isValidLap = (time: string | undefined): boolean => {
  if (!time) return false;
  if (time === "NaN") return false;
  if (time === "00:00.000") return false;
  if (time === "00:00:00.000") return false;
  if (time === "0:00.000") return false;
  if (time.startsWith("00:00:")) return false;
  if (time.startsWith("0 days 00:00")) return false;

  return true;
};

export const isSessionMatch = (
  lapSession: string,
  activeTab: "RACE" | "QUALY",
): boolean => {
  if (!lapSession) return false;

  if (activeTab === "QUALY") {
    return (
      lapSession === "QUALY" ||
      lapSession === "Qualifying" ||
      lapSession.startsWith("Q")
    );
  }

  return lapSession === "Race" || lapSession === "RACE";
};
