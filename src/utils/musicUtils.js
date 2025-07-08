export const loadMusicLibraryWithDurations = async (musicLibraryData) => {
  const tracksWithDurations = await Promise.all(
    musicLibraryData.map(
      (track) =>
        new Promise((resolve) => {
          const tempAudio = new Audio(track.file);
          tempAudio.addEventListener("loadedmetadata", () => {
            resolve({ ...track, duration: tempAudio.duration });
          });
        })
    )
  );
  return tracksWithDurations;
};
