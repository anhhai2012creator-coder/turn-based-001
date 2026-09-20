// ==========================================
// FILE: src/Character.js
// ==========================================

// 1. LỚP ĐỐI TƯỢNG NHÂN VẬT (CHARACTER CLASS)
// Chứa các chỉ số và logic cơ bản mà TẤT CẢ nhân vật đều phải có
class Character {
    constructor(id, data) {
        this.id = id;
        this.name = data.name;
        this.classType = data.class_type; // ATK, DEF, SKL
        this.level = 1;
        this.max_level = 220;

        // Chỉ số cơ bản (Base Stats)
        this.max_hp = data.base_stats.hp;
        this.hp = this.max_hp;
        this.atk = data.base_stats.atk;
        this.def = data.base_stats.def;
        this.spd = data.base_stats.spd;
        
        // Hệ thống Năng lượng (EN)
        this.max_en = data.base_stats.max_en;
        this.current_en = 0.0;

        // Cơ chế bạo kích mặc định toàn game
        this.crit_rate = 18.0; // 18% tỉ lệ chí mạng
        this.crit_damage = 300.0; // Sát thương x3 (300%)

        // Các chỉ số phụ trợ trong trận
        this.shield = 0; // Lớp khiên
        this.bonus_damage = 0; // % sát thương tăng thêm (như từ Huyết Kích)
        this.armor_pen = 0; // Xuyên giáp
    }

    // Hàm Hồi Năng lượng (EN)
    gainEN(amount) {
        this.current_en = Math.min(this.current_en + amount, this.max_en);
    }

    // Hàm Tiêu hao Năng lượng (Kỹ năng chủ động)
    consumeAllEN() {
        this.current_en = 0;
    }

    // Hàm tính toán và nhận sát thương
    takeDamage(rawDamage, isCrit, attackerArmorPen = 0) {
        // Công thức giảm ST: 5 DEF = 0.5% giảm ST => 1 DEF = 0.1% giảm ST
        let damageReduction = (this.def * 0.001) - attackerArmorPen;
        
        // Giới hạn giảm sát thương tối đa là 85% để tránh bất tử
        damageReduction = Math.max(0, Math.min(damageReduction, 0.85));

        // Sát thương thực tế sau khi trừ giáp
        let actualDamage = rawDamage * (1 - damageReduction);

        // Nhân sát thương nếu có bạo kích
        if (isCrit) {
            actualDamage *= (this.crit_damage / 100);
        }

        // Trừ vào Khiên trước khi trừ vào Máu (HP)
        if (this.shield > 0) {
            if (this.shield >= actualDamage) {
                this.shield -= actualDamage;
                actualDamage = 0;
            } else {
                actualDamage -= this.shield;
                this.shield = 0;
            }
        }

        // Trừ HP
        this.hp -= actualDamage;
        if (this.hp < 0) this.hp = 0; // Không để HP âm

        return actualDamage;
    }
}

// 2. KHO DỮ LIỆU NHÂN VẬT CHUẨN (CHARACTER DATABASE)
// Nơi lưu trữ bộ kỹ năng và mốc mở khóa của các nhân vật bạn đã thiết kế
const CharacterDatabase = {
    "char_madara_001": {
        name: "Madara (Lục đạo)",
        class_type: "ATK",
        base_stats: { hp: 235, atk: 17.9, def: 30, spd: 150, max_en: 5 },
        skills: {
            basic: { 
                name: "Đánh thường", 
                en_regen: 1.3, 
                desc: "Gây 98% ATK lên 1 mục tiêu kèm 2% HP tối đa của mục tiêu" 
            },
            active: { 
                name: "Chủ động", 
                en_cost: "ALL", 
                desc: "Gây ST diện rộng 200% ATK + 5% HP tối đa mục tiêu. Hút máu 20% ST gây ra. Tăng 5% ST gây ra trong 3 hiệp." 
            }
        },
        unlocks: {
            passive_1_lv40: "Nhận hồi phục kích hoạt Khiên bằng 8% HP tối đa",
            passive_2_lv80: "HP dưới 30% kích hoạt Huyết Kích",
            spell_1_lv150: "Tăng 8% ATK; 10% DEF",
            spell_2_lv220: "Tăng 15% tỉ lệ bạo kích; ST bạo kích tăng 50%"
        }
    },

    "char_omega_001": {
        name: "Omega Shenron",
        class_type: "DEF",
        base_stats: { hp: 325, atk: 11, def: 52, spd: 152, max_en: 4 },
        skills: {
            basic: { 
                name: "Đánh thường", 
                en_regen: 0.9, 
                desc: "Gây 78% ATK lên 1 mục tiêu" 
            },
            active: { 
                name: "Chủ động", 
                en_cost: "ALL", 
                desc: "Gây 300% ATK lên 1 mục tiêu HP thấp nhất. Nhận khiên bằng 20% ST gây ra" 
            }
        },
        unlocks: {
            passive_1_lv40: "Hiệp 1, nhận khiên 100% HP",
            passive_2_lv80: "Gây ST đánh dấu Thiên Mệnh (3 tầng cướp 3% HP)",
            spell_1_lv150: "Tăng 20% DEF; 5% HP tối đa",
            spell_2_lv220: "Xuyên giáp +10%"
        }
    },

    "char_zafkiel_001": {
        name: "Zafkiel (Thao Túng Thời Gian)",
        class_type: "SKL",
        base_stats: { hp: 200, atk: 12, def: 20, spd: 180, max_en: 4 },
        skills: {
            basic: { 
                name: "Đánh thường", 
                en_regen: 1.5, 
                desc: "Gây 60% ATK lên mục tiêu hàng trước" 
            },
            active: { 
                name: "Cấp cứu", 
                en_cost: "ALL", 
                desc: "Hồi 150% ATK cho 1 đồng minh HP thấp nhất, truyền toàn bộ EN cho đồng minh đó" 
            }
        },
        unlocks: {
            passive_1_lv40: "Đánh thường giảm 5 SPD mục tiêu",
            passive_2_lv80: "Nghịch đảo: Tạo khiên 15% HP cho đồng minh sắp nhận ST chí mạng (1 lần/trận)",
            spell_1_lv150: "Tăng 30 SPD; 10% HP tối đa",
            spell_2_lv220: "Mọi lượng hồi máu có 50% tỉ lệ bạo kích (x3 hồi máu)"
        }
    }
};

// Cú pháp để các file khác có thể gọi dữ liệu từ file này
// export { Character, CharacterDatabase };
