import { useParams } from "react-router";

export default function ChatPage() {
    const { id } = useParams<{ id: string }>();

    return <div>ChatPage {id} </div>;
}
