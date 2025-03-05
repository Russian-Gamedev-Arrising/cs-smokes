import { Button } from "@shared/ui/button"
import { useNavigate } from "react-router-dom"

export function GoBack() {
    const navigate = useNavigate()

    function clickHandler() {
        navigate(-1)
    }

    return (
        <Button variant='ghost' onClick={clickHandler}>
            Назад
        </Button>
    )
}
