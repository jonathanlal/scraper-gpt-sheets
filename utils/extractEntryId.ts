export function extractEntryId(id: string) {
  return parseInt(id.replaceAll(`${process.env.TARGET_DOMAIN}/?p=`, ''));
}
