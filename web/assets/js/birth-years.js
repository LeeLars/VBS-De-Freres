/**
 * Dynamische geboortejaren voor inschrijvingsformulieren.
 * Berekent welke geboortejaren welkom zijn in peuter, kleuter en lagere school
 * op basis van het huidige schooljaar (september = nieuw schooljaar).
 *
 * Vlaams systeem:
 * - Peuter: instap vanaf 2,5 jaar → geboortejaar schooljaarStart-3 en schooljaarStart-2
 * - Kleuter K1-K3: geboortejaar schooljaarStart-6 t/m schooljaarStart-4
 * - Lagere school 1ste-6de: geboortejaar schooljaarStart-12 t/m schooljaarStart-7
 */
(function () {
    const now = new Date();
    const month = now.getMonth(); // 0=jan, 8=sept
    // Schooljaar start in september: voor sept = vorig jaar, vanaf sept = dit jaar
    const schoolYearStart = month >= 8 ? now.getFullYear() : now.getFullYear() - 1;

    const years = [];

    // Peuter (nieuwste eerst)
    years.push({ value: schoolYearStart - 2, label: String(schoolYearStart - 2) });
    years.push({ value: schoolYearStart - 3, label: String(schoolYearStart - 3) });

    // Kleuter K1-K3
    for (let i = 4; i <= 6; i++) {
        const y = schoolYearStart - i;
        years.push({ value: y, label: String(y) });
    }

    // Lagere school 1ste-6de
    for (let i = 7; i <= 12; i++) {
        const y = schoolYearStart - i;
        years.push({ value: y, label: String(y) });
    }

    // Populate all selects with class "birth-year-select"
    document.querySelectorAll('.birth-year-select').forEach(select => {
        // Keep the first placeholder option
        const placeholder = select.querySelector('option');
        select.innerHTML = '';
        if (placeholder) select.appendChild(placeholder);

        years.forEach(yr => {
            const opt = document.createElement('option');
            opt.value = yr.value;
            opt.textContent = yr.label;
            select.appendChild(opt);
        });
    });
})();
