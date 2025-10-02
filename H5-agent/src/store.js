// src/store.js
window.KKStore = (function () {
    const DATA = 'kk_data_v1';
    const UI = 'kk_ui_v1';

    function load(k) {
        try {
            return JSON.parse(localStorage.getItem(k)) || {}
        } catch (e) {
            return {}
        }
    }

    function save(k, v) {
        localStorage.setItem(k, JSON.stringify(v));
    }

    function seed() {
        const s = load(DATA);
        if (!s.seeded) {
            const now = Date.now();
            s.metrics = Array.from({length: 16}).map((_, i) => ({
                ts: now - (15 - i) * 3600 * 1000,
                newUsers: ~~(Math.random() * 3),
                hall: ~~(Math.random() * 20),
                game: ~~(Math.random() * 15)
            }));
            s.agents = [{id: 101, username: 'agent001', nickname: '一级代理A', parent: null, status: 'normal'},
                {id: 102, username: 'agent002', nickname: '二级代理B', parent: 101, status: 'normal'}];
            s.members = [{id: 201, nickname: '会员1', parent: 101, vip: 2, regAt: now - 86400 * 1000 * 2},
                {id: 202, nickname: '会员2', parent: 102, vip: 1, regAt: now - 86400 * 1000 * 1},
                {id: 203, nickname: '会员3', parent: 102, vip: 3, regAt: now - 86400 * 1000 * 0}];
            s.rebateFixed = {
                agent: {'彩票': 0.01, '体育': 0.01, '捕鱼': 0.01, '棋牌': 0.01, '视讯': 0.01, '电子': 0.01},
                member: {'彩票': 0.02, '体育': 0.02, '捕鱼': 0.02, '棋牌': 0.02, '视讯': 0.02, '电子': 0.02}
            };
            s.tiered = {
                '视讯:九鼎': Object.fromEntries(Array.from({length: 9}, (_, i) => ['VIP' + i, 0])),
                '视讯:evo': Object.fromEntries(Array.from({length: 9}, (_, i) => ['VIP' + i, 0]))
            };
            s.seeded = true;
            save(DATA, s);
        }
        const ui = load(UI);
        if (!ui.ready) {
            ui.theme = 'blue';
            ui.compact = false;
            ui.sidebarMini = false;
            ui.openeds = ['grp-dashboard'];
            ui.ready = true;
            save(UI, ui);
        }
    }

    seed();
    return {
        data() {
            return load(DATA)
        }, saveData(v) {
            save(DATA, v)
        },
        ui() {
            return load(UI)
        }, saveUI(v) {
            save(UI, v)
        },
        upData(fn) {
            const s = this.data();
            const v = fn(s);
            save(DATA, v === undefined ? s : v);
        },
        upUI(fn) {
            const s = this.ui();
            const v = fn(s);
            save(UI, v === undefined ? s : v);
        },
        fmt: n => (n || 0).toFixed(2), ts: t => new Date(t).toISOString().replace('T', ' ').slice(0, 19)
    };
})();