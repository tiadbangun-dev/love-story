let data = {
    namaCewek: '', namaCowok: '', tanggalJadian: '',
    kesanPesan: '', harapan: '', yangMau: '',
    yangDilarang: '', kataManis: ''
};

const pages = document.querySelectorAll('.page');
let currentPage = 0;
let counterInterval;

// Page 1: Data Form
document.getElementById('dataForm').addEventListener('submit', function(e) {
    e.preventDefault();
    data.namaCewek = document.getElementById('namaCewek').value;
    data.namaCowok = document.getElementById('namaCowok').value;
    data.tanggalJadian = document.getElementById('tanggalJadian').value;
    nextPage();
    setTimeout(updateBucinPage, 300);
});

// Page 3: Kenangan Form
document.getElementById('kenanganForm').addEventListener('submit', function(e) {
    e.preventDefault();
    data.kesanPesan = document.getElementById('kesanPesan').value;
    data.harapan = document.getElementById('harapan').value;
    data.yangMau = document.getElementById('yangMau').value;
    data.yangDilarang = document.getElementById('yangDilarang').value;
    data.kataManis = document.getElementById('kataManis').value;
    nextPage();
    setTimeout(showResult, 300);
});

// Navigation
function nextPage() {
    pages[currentPage].classList.remove('active');
    currentPage++;
    if (currentPage < pages.length) {
        pages[currentPage].classList.add('active');
    }
}

// Page 2: Update Bucin
function updateBucinPage() {
    const title = document.getElementById('bucinTitle');
    const hariSpan = document.getElementById('hariBersama');
    
    title.innerHTML = `${data.namaCowok}, ${data.namaCewek} <br>sayang banget sama kamu 💕`;
    
    // Hitung hari
    const jadian = new Date(data.tanggalJadian);
    const sekarang = new Date();
    const hari = Math.floor((sekarang - jadian) / (1000 * 60 * 60 * 24));
    
    // Counter animation
    let count = 0;
    counterInterval = setInterval(() => {
        if (count <= hari) {
            hariSpan.textContent = count;
            count++;
        } else {
            clearInterval(counterInterval);
            hariSpan.textContent = hari;
        }
    }, 30);
}

// Page 4: Show Result
function showResult() {
    const summary = document.getElementById('loveSummary');
    const url = new URL(window.location.href);
    url.searchParams.set('data', btoa(JSON.stringify(data)));
    document.getElementById('shareUrl').value = url.toString();
    
    summary.innerHTML = `
        <div style="background: linear-gradient(135deg, #fef7ff, #fff7ed); padding: 1.5rem; border-radius: 16px; margin-bottom: 1.5rem; border: 1px solid rgba(236,72,153,0.2);">
            <h3 style="color: #ec4899; margin-bottom: 0.5rem;">💕 ${data.namaCewek} & ${data.namaCowok}</h3>
            <p style="color: #64748b; margin: 0; font-size: 0.95rem;">Jadian: ${new Date(data.tanggalJadian).toLocaleDateString('id-ID')}</p>
        </div>
        <div style="font-size: 0.95rem; line-height: 1.6; color: #334155;">
            <p><strong>💭 Kesan:</strong> ${data.kesanPesan.substring(0, 100)}${data.kesanPesan.length > 100 ? '...' : ''}</p>
            <p><strong>🌟 Harapan:</strong> ${data.harapan.substring(0, 80)}${data.harapan.length > 80 ? '...' : ''}</p>
            <p><strong>🍬 Kata Manis:</strong> "${data.kataManis.substring(0, 60)}${data.kataManis.length > 60 ? '...' : ''}"</p>
        </div>
        <p style="font-size: 0.85rem; color: #94a3b8; margin-top: 1.5rem; font-style: italic;">
            👆 Klik "Bagikan" untuk link lengkap semua jawaban!
        </p>
    `;
    
    document.getElementById('shareLink').style.display = 'flex';
}

// Share Functions
function shareLink() {
    document.getElementById('shareLink').style.display = 'flex';
    document.getElementById('shareUrl').select();
}

function copyLink() {
    const urlInput = document.getElementById('shareUrl');
    urlInput.select();
    document.execCommand('copy');
    
    // Feedback
    const originalText = urlInput.nextElementSibling.textContent;
    urlInput.nextElementSibling.textContent = '✅ Tersalin!';
    urlInput.nextElementSibling.style.background = '#10b981';
    urlInput.nextElementSibling.style.color = 'white';
    
    setTimeout(() => {
        urlInput.nextElementSibling.textContent = originalText;
        urlInput.nextElementSibling.style.background = '';
        urlInput.nextElementSibling.style.color = '';
    }, 2000);
}

// Reset Everything
function resetAll() {
    // Clear data
    Object.keys(data).forEach(key => data[key] = '');
    
    // Clear forms
    document.getElementById('dataForm').reset();
    document.getElementById('kenanganForm').reset();
    
    // Reset pages
    pages.forEach(page => page.classList.remove('active'));
    currentPage = 0;
    pages[0].classList.add('active');
    
    // Clear counter
    if (counterInterval) clearInterval(counterInterval);
    
    // Hide share link
    document.getElementById('shareLink').style.display = 'none';
    
    // Reset bucin title
    document.getElementById('bucinTitle').textContent = 'Loading...';
}

// Load from URL params (Share feature)
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const savedData = urlParams.get('data');
    
    if (savedData) {
        try {
            const parsedData = JSON.parse(atob(savedData));
            Object.assign(data, parsedData);
            
            // Skip to result
            nextPage();
            nextPage();
            nextPage();
            updateBucinPage();
            showResult();
        } catch(e) {
            console.log('Invalid saved data');
        }
    }
});

// Prevent zoom on iOS
document.addEventListener('touchstart', function() {}, true);
