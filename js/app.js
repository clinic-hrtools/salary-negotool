/**
 * App — Tab switching, event binding, initialization
 */
document.addEventListener('DOMContentLoaded', () => {
    // === Tab Switching ===
    const tabBtns = document.querySelectorAll('.tab-button');
    const panels = document.querySelectorAll('.tab-panel');
    const indicator = document.querySelector('.tab-indicator');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            panels.forEach(p => p.classList.remove('active'));
            document.getElementById(`panel-${tab}`).classList.add('active');
            indicator.classList.toggle('right', tab === 'bonus');
        });
    });

    // === Raise Calculator ===
    document.getElementById('calc-raise-btn').addEventListener('click', () => {
        const wage = parseFloat(document.getElementById('current-wage').value);
        const hours = parseFloat(document.getElementById('weekly-hours').value);
        const tier = document.getElementById('tier-select').value;
        const eval_ = document.getElementById('eval-select').value;

        const err = RaiseCalculator.validate(wage, tier, eval_, hours);
        if (err) { showToast(err); return; }

        const result = RaiseCalculator.calculate(wage, tier, parseInt(eval_), hours);
        RaiseCalculator.renderResults(result);
    });

    // === Bonus Calculator ===
    document.getElementById('calc-bonus-btn').addEventListener('click', () => {
        const lastRev = parseFloat(document.getElementById('last-year-revenue').value);
        const thisRev = parseFloat(document.getElementById('this-year-revenue').value);
        const eval_ = document.getElementById('bonus-eval-select').value;
        const base = parseFloat(document.getElementById('monthly-base').value);
        const laborCost = parseFloat(document.getElementById('annual-labor-cost').value) || 0;

        const err = BonusCalculator.validate(lastRev, thisRev, eval_, base);
        if (err) { showToast(err); return; }

        const result = BonusCalculator.calculate(lastRev, thisRev, parseInt(eval_), base, laborCost);
        BonusCalculator.renderResults(result);
    });

    // === Toast Notification ===
    function showToast(msg) {
        let toast = document.getElementById('toast-msg');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast-msg';
            toast.style.cssText = `
                position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
                background: var(--accent-red); color: #fff; padding: 12px 24px;
                border-radius: 12px; font-size: 0.88rem; font-weight: 500;
                z-index: 9999; box-shadow: 0 6px 24px rgba(248,113,113,0.3);
                opacity: 0; transition: opacity 0.3s ease;
                font-family: var(--font-family);
            `;
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.opacity = '1';
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 2800);
    }
});
