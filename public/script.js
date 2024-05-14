document.addEventListener("DOMContentLoaded", function () {
    // Function to fetch data from server
    async function fetchData() {
        try {
            const response = await fetch('/cryptoData');
            const data = await response.json();
            displayCryptoData(data);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    }

    // Function to display crypto data on the page
    function displayCryptoData(data) {
        const cryptoList = document.getElementById('cryptoList');
        cryptoList.innerHTML = '';

        data.forEach(crypto => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${crypto.name}</span> Last: ${crypto.last}, Buy: ${crypto.buy}, Sell: ${crypto.sell}, Volume: ${crypto.volume}, Base Unit: ${crypto.base_unit}`;
            cryptoList.appendChild(li);
        });
    }

    // Function to update countdown timer
    function updateCountdown() {
        const countdown = document.getElementById('countdown');
        let count = parseInt(countdown.textContent);
        count = (count === 0) ? 60 : count - 1;
        countdown.textContent = count;
    }

    // Start countdown timer
    setInterval(updateCountdown, 1000);

    // Fetch data when page loads
    fetchData();

    // Event listener for main dropdown change
    const mainDropdown = document.getElementById('mainDropdown');
    mainDropdown.addEventListener('change', function () {
        const subDropdown = document.getElementById('subDropdown');
        subDropdown.innerHTML = '';

        if (mainDropdown.value === 'TRX') {
            const coins = ['BTC', 'ETH', 'USDT', 'XRP', 'TRX'];
            coins.forEach(coin => {
                const option = document.createElement('option');
                option.value = coin;
                option.textContent = coin;
                subDropdown.appendChild(option);
            });
            subDropdown.disabled = false;
            document.getElementById('buyButton').disabled = false;
        } else {
            subDropdown.disabled = true;
            document.getElementById('buyButton').disabled = true;
        }
    });
});
