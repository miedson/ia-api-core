export async function embed(text: string): Promise<number[]> {
  const res = await fetch('http://embedding:3001/embed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })

  const json: any = await res.json()
  return json.vector
}
