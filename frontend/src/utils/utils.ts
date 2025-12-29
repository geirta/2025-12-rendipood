export async function calculatePrice(filmId: number, days: number): Promise<number> {
  const res = await fetch('http://localhost:8080/calculate-cart-film', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filmId, days }),
  });

  const data = await res.json();
  return data.price;
}