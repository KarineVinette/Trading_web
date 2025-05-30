// Fonction simple pour calculer RSI en JS
function computeRSI(closes, period = 14) {
    let gains = 0;
    let losses = 0;
    for (let i = 1; i <= period; i++) {
      let diff = closes[i] - closes[i - 1];
      if (diff >= 0) gains += diff;
      else losses -= diff;
    }
    let avgGain = gains / period;
    let avgLoss = losses / period;
    let rs = avgGain / avgLoss;
    let rsi = 100 - (100 / (1 + rs));
    return rsi;
  }
  
  // Récupérer les données de prix Bitcoin sur 30 jours avec CoinGecko
  async function fetchCryptoRSI(id, name) {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=30&interval=daily`);
    const data = await res.json();
    const closes = data.prices.map(p => p[1]);
  
    if (closes.length < 15) {
      return { name, rsi: null, signal: "Pas assez de données" };
    }
  
    const rsi = computeRSI(closes.slice(-15));
    let signal = "HOLD";
    if (rsi < 30) signal = "BUY";
    else if (rsi > 70) signal = "SELL";
  
    return { name, rsi: rsi.toFixed(2), signal };
  }
  
  async function main() {
    const resultDiv = document.getElementById('resultats2');
    resultDiv.innerHTML = 'Chargement des données...';
  
    // Liste des cryptos CoinGecko id à analyser
    const cryptos = [
      { id: 'bitcoin', name: 'Bitcoin (BTC)' },
      { id: 'ethereum', name: 'Ethereum (ETH)' },
      { id: 'binancecoin', name: 'Binance Coin (BNB)' },
      { id: 'ripple', name: 'Ripple (XRP)' }
    ];
  
    const results = [];
    for (const crypto of cryptos) {
      const res = await fetchCryptoRSI(crypto.id, crypto.name);
      results.push(res);
    }
  
    resultDiv.innerHTML = results.map(r =>
      `<p><strong>${r.name}</strong> — RSI: ${r.rsi ?? 'N/A'} — Signal: ${r.signal}</p>`
    ).join('');
  }
  
  main();
  
