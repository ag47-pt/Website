const form = document.getElementById('assessment-form');
const resultBox = document.getElementById('result-box');
const scoreValue = document.getElementById('score-value');
const recommendationText = document.getElementById('recommendation-text');
const totalCost = document.getElementById('total-cost');
const yieldValue = document.getElementById('yield-value');
const discountValue = document.getElementById('discount-value');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = Object.fromEntries(new FormData(form).entries());

  const response = await fetch('/api/assess', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  scoreValue.textContent = `${data.score}`;
  recommendationText.textContent = data.recommendation;
  totalCost.textContent = `€${Number(data.total_cost).toLocaleString('pt-PT')}`;
  yieldValue.textContent = `${data.yield_pct}%`;
  discountValue.textContent = `${data.discount_vs_market}%`;
  resultBox.classList.remove('hidden');
});
