import { CBadge } from '@coreui/react';

function StatusBadge({ status }) {
    let badgeColor = '';
    let badgeText = '', textColor = " ";

    // Defina as cores e textos de acordo com o status
    switch (status) {
        case 1: // Se status for 1
            badgeColor = 'bg-primary'; // Cor azul
            badgeText = 'Aguardando'; // Texto 'Aguardando'

            break;
        case 2: // Se status for 2
            badgeColor = 'bg-warning'; // Cor amarela
            textColor = " text-black"
            badgeText = 'Em andamento'; // Texto 'Em andamento'
            break;
        case 5: // Se status for 5
            badgeColor = 'bg-danger'; // Cor vermelha
            badgeText = 'Recusado'; // Texto 'Cancelado'
            break;
        case 3: // Se status for 3
            badgeColor = 'bg-success'; // Cor verde
            textColor = " text-black"
            badgeText = 'Aprovado'; // Texto 'Ativo'
            break;
        case 4: // Se status for 4
            badgeColor = 'bg-info'; // Cor azul clara
            badgeText = 'Finalizado'; // Texto 'Finalizado'
            break;
        case 5: // Se status for 5
            badgeColor = 'bg-danger'; // Cor vermelha
            badgeText = 'Cancelado'; // Texto 'Cancelado'
            break;
        default: // Se status não corresponder a nenhum dos casos acima
            badgeColor = 'bg-secondary'; // Cor cinza
            badgeText = 'Desconhecido'; // Texto 'Desconhecido'
            break;
    }

    return (
        <CBadge className={badgeColor + textColor}>{badgeText}</CBadge>
    );
}

function VistoBadge({ status }) {
    let badgeColor = '';
    let badgeText = '', textColor;

    // Defina as cores e textos de acordo com o status
    switch (status) {
        case 1: // Se status for 1
            badgeColor = 'bg-warning'; // Cor amarela
            textColor = " text-black"

            badgeText = 'Turismo'; // Texto 'Aguardando'

            break;
        case 2: // Se status for 2
            badgeColor = 'bg-primary'; // Cor azul
            textColor = ""
            badgeText = 'Trabalho'; // Texto 'Em andamento'
            break;
        case 5: // Se status for 5
            badgeColor = 'bg-info'; // Cor azul clara
            badgeText = 'Curta Duração'; // Texto 'Cancelado'
            textColor = ""
            break;
        case 3: // Se status for 3
            badgeColor = 'bg-success'; // Cor verde
            badgeText = 'Fronteira'; // Texto 'Ativo'
            textColor = " text-black"
            break;
        default: // Se status não corresponder a nenhum dos casos acima
            badgeColor = 'bg-secondary'; // Cor cinza
            badgeText = 'Desconhecido'; // Texto 'Desconhecido'
            break;
    }

    return (
        <CBadge className={badgeColor + textColor}>{badgeText}</CBadge>
    );
}

export { StatusBadge, VistoBadge }
