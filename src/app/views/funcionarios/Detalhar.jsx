const { useParams } = require("react-router-dom")



export default function Detalhar() {
    const { funcionarioId } = useParams()
    return (
        <>FUNCIOARIO {funcionarioId}</>
    )
}