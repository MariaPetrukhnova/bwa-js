import { createFighterImage } from '../fighterPreview';
import showModal from './modal';

export default function showWinnerModal(fighter) {
    const fighterImage = createFighterImage(fighter);
    const modal = {
        title: `${fighter.name.toUpperCase()} win!!!`,
        bodyElement: fighterImage,
        onClose: () => {
            window.location.reload();
        }
    };

    showModal(modal);
}
