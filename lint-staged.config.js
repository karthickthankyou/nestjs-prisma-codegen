module.exports = {
  '*.{ts,tsx}': (filenames) => ['npm run format:write', 'npm run build'],
}
