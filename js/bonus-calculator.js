/**
 * Bonus Calculator Module
 * Revenue increase sharing bonus + labor cost ratio guideline
 */
const BonusCalculator = (() => {
    const SHARE_RATES = { 1: 0.15, 2: 0.13, 3: 0.10, 4: 0.00 };
    const ALL_RATES = [
        { rate: 0.15, label: '15%', evalLabel: '평가 1 (최우수)', id: '15' },
        { rate: 0.13, label: '13%', evalLabel: '평가 2 (우수)', id: '13' },
        { rate: 0.10, label: '10%', evalLabel: '평가 3 (보통)', id: '10' },
    ];
    const EVAL_LABELS = {
        1: '평가 1 (최우수)', 2: '평가 2 (우수)',
        3: '평가 3 (보통)', 4: '평가 4 (개선필요)',
    };

    function calculate(lastYearRev, thisYearRev, evaluation, monthlyBase, annualLaborCost) {
        const increase = thisYearRev - lastYearRev;
        const growthRate = lastYearRev > 0 ? (increase / lastYearRev) * 100 : 0;
        const bonusByRate = ALL_RATES.map(r => ({
            ...r, bonus: increase > 0 ? increase * r.rate : 0,
        }));
        const empRate = SHARE_RATES[evaluation] || 0;
        const finalBonus = (increase > 0 && empRate > 0) ? increase * empRate : 0;
        const projectedRev = thisYearRev * (1 + growthRate / 100);
        const laborCost = annualLaborCost > 0 ? annualLaborCost : monthlyBase * 12;
        const laborRatio = projectedRev > 0 ? (laborCost / projectedRev) * 100 : 0;

        return {
            revenueIncrease: increase, revenueGrowthRate: growthRate,
            bonusByRate, evaluation, employeeShareRate: empRate,
            finalBonus, projectedRevenue: projectedRev,
            laborCost, laborCostRatio: laborRatio,
            isNegativeGrowth: increase <= 0,
            isNoBonus: evaluation === 4 || increase <= 0,
        };
    }

    function fmt(v) {
        return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    function renderResults(r) {
        if (!r) return;
        const area = document.getElementById('bonus-results');
        area.style.display = 'block';

        const incEl = document.getElementById('revenue-increase');
        incEl.textContent = fmt(r.revenueIncrease);
        incEl.style.color = r.isNegativeGrowth ? 'var(--accent-red)' : '';
        document.getElementById('revenue-growth-rate').textContent = r.revenueGrowthRate.toFixed(1) + '%';

        const maxB = Math.max(...r.bonusByRate.map(b => b.bonus), 1);
        r.bonusByRate.forEach(b => {
            document.getElementById(`bonus-${b.id}`).textContent = fmt(b.bonus);
            setTimeout(() => {
                document.getElementById(`bar-fill-${b.id}`).style.width = (b.bonus / maxB * 100) + '%';
            }, 100);
        });

        document.querySelectorAll('.bonus-bar-card').forEach(c => c.classList.remove('selected'));
        const selRate = ALL_RATES.find(x => x.rate === r.employeeShareRate);
        if (selRate) {
            const card = document.querySelector(`.bonus-bar-card[data-rate="${selRate.id}"]`);
            if (card) card.classList.add('selected');
        }

        const fc = document.getElementById('final-bonus-card');
        document.getElementById('final-eval-label').textContent = EVAL_LABELS[r.evaluation];
        if (r.isNoBonus) {
            fc.classList.add('no-bonus'); fc.classList.remove('accent-card');
            document.getElementById('final-share-rate').textContent =
                r.evaluation === 4 ? '공유율 0% (보너스 해당 없음)' : '매출 감소로 보너스 없음';
            document.getElementById('final-bonus-amount').textContent = '보너스 없음';
        } else {
            fc.classList.remove('no-bonus'); fc.classList.add('accent-card');
            document.getElementById('final-share-rate').textContent =
                `공유율 ${(r.employeeShareRate * 100).toFixed(0)}% 적용`;
            document.getElementById('final-bonus-amount').textContent = fmt(r.finalBonus);
        }

        document.getElementById('projected-revenue').textContent = fmt(r.projectedRevenue);
        document.getElementById('growth-applied').textContent = `올해 성장률 ${r.revenueGrowthRate.toFixed(1)}% 적용`;
        document.getElementById('labor-cost-ratio').textContent = r.laborCostRatio.toFixed(1) + '%';
        document.getElementById('labor-detail').textContent = `${fmt(r.laborCost)} / ${fmt(r.projectedRevenue)}`;
        area.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function validate(lastRev, thisRev, evaluation, base) {
        if (lastRev === null || lastRev === undefined || lastRev < 0) return '전년도 개인매출을 입력해주세요.';
        if (thisRev === null || thisRev === undefined || thisRev < 0) return '올해 개인매출을 입력해주세요.';
        if (!evaluation) return '올해 평가 등급을 선택해주세요.';
        if (!base || base <= 0) return '월 기본급을 입력해주세요.';
        return null;
    }

    return { calculate, renderResults, validate, formatCurrency: fmt };
})();
