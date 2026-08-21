function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDimensions(width: number | null, height: number | null): string {
  if (width && height) {
    return `${width} × ${height}`;
  }
  return "Dimensions unavailable";
}

export { formatDimensions, formatFileSize };
