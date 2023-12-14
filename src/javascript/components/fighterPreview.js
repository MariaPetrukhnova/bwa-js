import createElement from '../helpers/domHelper';

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });
    return imgElement;
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (fighter) {
        const fighterImage = createFighterImage(fighter);
        const fighterName = createElement({ tagName: 'h2', className: 'fighter-preview___title' });
        const fighterData = createElement({ tagName: 'ul', className: 'fighter-preview___infoList' });
        const fighterInfoBlock = createElement({ tagName: 'section', className: 'fighter-preview___infoBlock' });

        fighterData.innerHTML = `
            <li class="fighter-preview___infoItem">
                <p>Health: ${fighter.health}</p>
            </li>
            <li class="fighter-preview___infoItem">
                <p>Attack: ${fighter.attack}</p>
            </li>
            <li class="fighter-preview___infoItem">
                <p>Defense: ${fighter.defense}</p>
            </li>
        `;

        fighterName.innerText = fighter.name;
        fighterInfoBlock.append(fighterName, fighterData);
        fighterElement.append(fighterImage, fighterInfoBlock);
    }

    return fighterElement;
}
