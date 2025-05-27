export default function getDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString('en-GB', {month: 'long', year: 'numeric'});
}