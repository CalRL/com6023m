export async function usernameFromEmail(email: string): Promise<string> {
    if(!email.includes("@")) throw new Error(`Email (${email}) does not include an aerobase (@)!`)
    const data = email.split("@");
    const username = data[0] + data[1];
    return username;
}
