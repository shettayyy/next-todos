export function getInitials(name1 = '', name2 = ''): string {
  // If name1 and name2 are not provided, return N/A
  if (!name1 && !name2) {
    return 'N/A';
  }

  // If name2 is not provided, return the first 2 letter of name1
  if (!name2) {
    return name1.charAt(0).toUpperCase() + name1.charAt(1).toUpperCase();
  }

  // If name1 and name2 are provided, return the first letter of each name
  return name1.charAt(0).toUpperCase() + name2.charAt(0).toUpperCase();
}
