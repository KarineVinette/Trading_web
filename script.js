const cryptos = [
    { name: 'Bitcoin', id: 'bitcoin' },
    { name: 'Ethereum', id: 'ethereum' },
    { name: 'Solana', id: 'solana' },
    { name: 'XRP', id: 'ripple' },
    { name: 'Cardano', id: 'cardano' },
    { name: 'Doge', id: 'dogecoin' },
    { name: 'Litecoin', id: 'litecoin' },
  ];
  
  async function afficherResultats() {
    const container = document.getElementById('resultats');
    container.innerHTML = '';
  
    const ids = cryptos.map(c => c.id).join(',');
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=1h,24h,7d`;
  
    try {
      const res = await fetch(url);
      const data = await res.json();
  
      data.forEach(asset => {
        const pc1h = asset.price_change_percentage_1h_in_currency ?? 0;
        const pc24h = asset.price_change_percentage_24h_in_currency ?? 0;
        const pc7d = asset.price_change_percentage_7d_in_currency ?? 0;
  
        const allUp = pc1h > 0 && pc24h > 0 && pc7d > 0;
        const allDown = pc1h < 0 && pc24h < 0 && pc7d < 0;
  
        const decision = allUp
          ? 'BUY 🔼'
          : allDown
          ? 'SELL 🔽'
          : 'WAIT ⏳';
  
        container.innerHTML += `
          <div class="card">
            <h2>${asset.name}</h2>
            <p>💰 Prix : $${asset.current_price}</p>
            <p>📈 1h : ${pc1h.toFixed(2)}%</p>
            <p>📈 24h : ${pc24h.toFixed(2)}%</p>
            <p>📈 7j : ${pc7d.toFixed(2)}%</p>
            <p><strong>📌 Conclusion : ${decision}</strong></p>
          </div>
        `;
      });
    } catch (err) {
      container.innerHTML = '❌ Erreur de chargement des données.';
      console.error(err);
    }
  }
  
  afficherResultats();
  
