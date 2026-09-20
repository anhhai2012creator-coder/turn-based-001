const StatusRegistry = {
    "huyết_kích": {
        name: "Huyết Kích",
        description: "Mỗi 1% HP mất đi tăng 2% ST gây ra",
        applyEffect: (character) => {
            let hpLostPercent = 100 - ((character.hp / character.max_hp) * 100);
            character.damageMultiplier += (hpLostPercent * 0.02);
        }
    },
    "thiên_mệnh": {
        name: "Thiên Mệnh",
        description: "Đủ 3 tầng, cướp 3% HP hiện tại",
        max_stacks: 3,
        onStackFull: (attacker, target) => {
            let stolenHP = target.hp * 0.03;
            target.hp -= stolenHP;
            attacker.heal(stolenHP);
            // Kích hoạt khiên của Madara nếu Madara là attacker (Bị động 1)
        }
    }
};
