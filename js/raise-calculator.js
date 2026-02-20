/**
 * Raise Calculator Module
 * Tier(A/B/C) × Evaluation(1/2/3/4) matrix-based hourly wage raise calculator
 */
const RaiseCalculator = (() => {
    // Raise percentage matrix: [tier][evaluation]
    const RAISE_MATRIX = {
        A: { 1: 8.0, 2: 6.0, 3: 4.0, 4: 2.0 },
        B: { 1: 6.0, 2: 4.5, 3: 3.0, 4: 1.5 },
        C: { 1: 4.0, 2: 3.0, 3: 2.0, 4: 1.0 },
    };

    const TIER_LABELS = { A: 'A', B: 'B', C: 'C' };
    const EVAL_LABELS = { 1: '1 (최우수)', 2: '2 (우수)', 3: '3 (보통)', 4: '4 (개선필요)' };

    /**
     * Get raise percentage from the matrix
     */
    function getRaisePercent(tier, evaluation) {
        if (!RAISE_MATRIX[tier] || RAISE_MATRIX[tier][evaluation] === undefined) {
            return null;
        }
        return RAISE_MATRIX[tier][evaluation];
    }

    /**
     * Calculate new wage and annual salary
     */
    function calculate(currentWage, tier, evaluation, weeklyHours) {
        const raisePercent = getRaisePercent(tier, evaluation);
        if (raisePercent === null) return null;

        const raiseMultiplier = 1 + raisePercent / 100;
        const newWage = currentWage * raiseMultiplier;
        const wageDiff = newWage - currentWage;

        // Annual salary: wage × hours/week × 52 weeks
        const currentAnnual = currentWage * weeklyHours * 52;
        const newAnnual = newWage * weeklyHours * 52;
        const annualDiff = newAnnual - currentAnnual;

        return {
            raisePercent,
            currentWage,
            newWage,
            wageDiff,
            currentAnnual,
            newAnnual,
            annualDiff,
            tier,
            evaluation,
        };
    }

    /**
     * Format currency
     */
    function formatCurrency(value) {
        return '$' + value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    /**
     * Render results to the DOM
     */
    function renderResults(result) {
        if (!result) return;

        const resultsArea = document.getElementById('raise-results');
        resultsArea.style.display = 'block';

        // Raise percent
        document.getElementById('raise-percent').textContent = result.raisePercent + '%';
        document.getElementById('raise-tier-eval').textContent =
            `Tier ${TIER_LABELS[result.tier]} · 평가 ${EVAL_LABELS[result.evaluation]}`;

        // New wage
        document.getElementById('new-wage').textContent = formatCurrency(result.newWage);
        document.getElementById('wage-diff').textContent =
            `+${formatCurrency(result.wageDiff)} / 시간`;

        // Annual salary
        document.getElementById('annual-salary').textContent = formatCurrency(result.newAnnual);
        document.getElementById('annual-diff').textContent =
            `+${formatCurrency(result.annualDiff)} / 년`;

        // Highlight matrix cell
        highlightMatrixCell(result.tier, result.evaluation);

        // Scroll to results smoothly
        resultsArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Highlight the selected cell in the matrix table
     */
    function highlightMatrixCell(tier, evaluation) {
        const table = document.getElementById('raise-matrix-table');
        if (!table) return;

        // Remove previous highlights
        table.querySelectorAll('td.highlight').forEach(td => td.classList.remove('highlight'));

        const tierIndex = { A: 0, B: 1, C: 2 }[tier];
        const evalIndex = parseInt(evaluation); // 1-indexed column (column 0 is label)

        if (tierIndex !== undefined && evalIndex >= 1 && evalIndex <= 4) {
            const row = table.querySelector('tbody').rows[tierIndex];
            if (row && row.cells[evalIndex]) {
                row.cells[evalIndex].classList.add('highlight');
            }
        }
    }

    /**
     * Validate inputs and return error message or null
     */
    function validate(currentWage, tier, evaluation, weeklyHours) {
        if (!currentWage || currentWage <= 0) return '현재 시급을 입력해주세요.';
        if (!tier) return 'Tier를 선택해주세요.';
        if (!evaluation) return '평가 등급을 선택해주세요.';
        if (!weeklyHours || weeklyHours <= 0) return '주당 근무시간을 입력해주세요.';
        return null;
    }

    return { calculate, renderResults, validate, formatCurrency, RAISE_MATRIX };
})();
