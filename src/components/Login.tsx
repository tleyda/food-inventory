import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { useAuth } from "../context/AuthContext";
import { LogIn } from "lucide-react";

export function Login() {
    const { loginWithGoogle } = useAuth();

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="flex flex-col gap-1 text-center pb-0">
                    <h2 className="text-2xl font-bold">Welcome to PantryApp</h2>
                    <p className="text-default-500">Please sign in to manage your inventory</p>
                </CardHeader>
                <CardBody className="py-8">
                    <Button 
                        color="primary" 
                        size="lg" 
                        variant="shadow"
                        startContent={<LogIn size={20} />}
                        onPress={loginWithGoogle}
                        className="w-full font-semibold"
                    >
                        Sign in with Google
                    </Button>
                </CardBody>
            </Card>
        </div>
    );
}
