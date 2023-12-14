import controls from '../../constants/controls';

export function getHitPower(fighter) {
    const criticalHitChance = Math.random() * (2 - 1) + 1;
    return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    const dodgeChance = Math.random() * (2 - 1) + 1;
    return fighter.defense * dodgeChance;
}

export function getDamage(attacker, defender) {
    const damage = getHitPower(attacker) - getBlockPower(defender);
    return damage > 0 ? damage : 0;
}

function fightingProcess(attacker, defender) {
    if (attacker.isBlocking) {
        return;
    }
    if (defender.isBlocking) {
        return;
    }

    const damage = getDamage(attacker, defender);
    defender.receiveDamage(damage);
}

function onDamageReceived(position, currentHealth, health) {
    const healthIndicator = document.getElementById(`${position}-fighter-indicator`);
    const indicatorWidth = Math.max(0, (currentHealth * 100) / health);
    healthIndicator.style.width = `${indicatorWidth}%`;
}

class Fighter {
    constructor({ position, name, health, attack, damage, defense, source }) {
        this.position = position;
        this.name = name;
        this.health = health;
        this.currentHealth = health;
        this.attack = attack;
        this.damage = damage;
        this.defense = defense;
        this.critPoints = 0;
        this.critAbility = false;
        this.isBlocking = false;
        this.isAttacking = false;
        this.source = source;
    }

    setIsBlocking(payload) {
        this.isBlocking = payload;
    }

    setIsAttacking(payload) {
        this.isAttacking = payload;
    }

    receiveDamage(value) {
        if (this.isBlocking === false) {
            this.currentHealth -= value;
            onDamageReceived(this.position, this.currentHealth, this.health);
        }
        return value;
    }

    setCritTimer() {
        this.critAbility = false;

        setTimeout(() => {
            this.critAbility = true;
        }, 10000);
    }

    critAttack(defender) {
        if (!this.critAbility) return;
        this.setCritTimer();
        defender.receiveDamage(this.attack * 2);
    }
}

function startFight(firstFighter, secondFighter, keyMap, currentCode) {
    if (currentCode === controls.PlayerOneBlock && !firstFighter.isAttacking) {
        firstFighter.setIsBlocking(true);
        return;
    }
    if (currentCode === controls.PlayerTwoBlock && !secondFighter.isAttacking) {
        secondFighter.setIsBlocking(true);
        return;
    }
    if (currentCode === controls.PlayerOneAttack && !firstFighter.isBlocking) {
        firstFighter.setIsAttacking(true);
        fightingProcess(firstFighter, secondFighter, keyMap);
        return;
    }
    if (currentCode === controls.PlayerTwoAttack && !secondFighter.isBlocking) {
        secondFighter.setIsAttacking(true);
        fightingProcess(secondFighter, firstFighter, keyMap);
        return;
    }
    if (controls.PlayerOneCriticalHitCombination.every(code => keyMap.has(code))) {
        firstFighter.critAttack(secondFighter);
        return;
    }
    if (controls.PlayerTwoCriticalHitCombination.every(code => keyMap.has(code))) {
        secondFighter.critAttack(firstFighter);
    }
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        const firstPlayer = new Fighter({ ...firstFighter, position: 'left' });
        const secondPlayer = new Fighter({ ...secondFighter, position: 'right' });

        firstPlayer.setCritTimer();
        secondPlayer.setCritTimer();

        const fightSet = new Map();

        function onKeyUp(e) {
            if (e.code === controls.PlayerOneAttack) {
                firstPlayer.setIsAttacking(false);
            }
            if (e.code === controls.PlayerTwoAttack) {
                secondPlayer.setIsAttacking(false);
            }
            if (e.code === controls.PlayerOneBlock) {
                firstPlayer.setIsBlocking(false);
            }
            if (e.code === controls.PlayerTwoBlock) {
                secondPlayer.setIsBlocking(false);
            }
            fightSet.delete(e.code);
        }

        function onKeyDown(e) {
            const gameKeys = Object.values(controls).flat(2);
            if (e.repeat || !gameKeys.some(key => key === e.code)) return;
            fightSet.set(e.code, true);
            startFight(firstPlayer, secondPlayer, fightSet, e.code);

            if (firstPlayer.currentHealth <= 0) {
                resolve(secondPlayer);
                document.removeEventListener('keydown', onKeyDown);
                document.removeEventListener('keyup', onKeyUp);
            } else if (secondPlayer.currentHealth <= 0) {
                resolve(firstPlayer);
                document.removeEventListener('keydown', onKeyDown);
                document.removeEventListener('keyup', onKeyUp);
            }
        }

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
    });
}
