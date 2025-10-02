// src/components.js
window.KKComponents = (function () {
    function tinyLineChart(canvas, series) {
        const ctx = canvas.getContext('2d');
        const W = canvas.width = canvas.clientWidth, H = canvas.height = 220, pad = 28;
        const all = series.flatMap(s => s.data.map(p => p.y));
        const minY = Math.min(0, ...all), maxY = Math.max(1, ...all);
        ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = '#dfe3ee';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(pad, H - pad);
        ctx.lineTo(W - pad, H - pad);
        ctx.moveTo(pad, pad);
        ctx.lineTo(pad, H - pad);
        ctx.stroke();
        const colors = ['#409EFF', '#10b981', '#f59e0b'];
        const x = (i, n) => pad + i * (W - 2 * pad) / Math.max(1, (n - 1));
        const y = v => H - pad - (v - minY) / (maxY - minY || 1) * (H - 2 * pad);
        series.forEach((s, idx) => {
            ctx.strokeStyle = colors[idx % colors.length];
            ctx.lineWidth = 2;
            ctx.beginPath();
            s.data.forEach((p, i) => {
                const px = x(i, s.data.length), py = y(p.y);
                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py)
            });
            ctx.stroke();
        });
    }

    Vue.component('page-header', {
        props: ['icon', 'title'], render(h) {
            return h('div', {staticClass: 'page-header'}, [h('i', {staticClass: this.icon}), h('div', {staticClass: 'title'}, this.title)])
        }
    });
    return {tinyLineChart};
})();