export const levenshteinDistance = (a: string, b: string) => {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i && j ? 0 : i + j))
  );

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1
        );
      }
    }
  }

  return matrix[a.length][b.length];
};

export const getClosestCourseCodes = (
  input: string,
  courseCodes: string[],
  numSuggestions: number = 5
) => {
  const distances = courseCodes.map((courseCode) => ({
    courseCode,
    distance: levenshteinDistance(input, courseCode),
  }));

  return distances
    .sort((a, b) => a.distance - b.distance)
    .slice(0, numSuggestions)
    .map((entry) => entry.courseCode);
};
