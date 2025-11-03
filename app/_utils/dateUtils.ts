export function formatISODate(isoDateString: string) {
  const dateObject = new Date(isoDateString + 'T00:00:00');

  const year = dateObject.getFullYear();
  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObject.getDate().toString().padStart(2, '0');

  const formattedDate = `${year}/${month}/${day}`;

  return formattedDate;
}

export function formatDateToISO(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}
