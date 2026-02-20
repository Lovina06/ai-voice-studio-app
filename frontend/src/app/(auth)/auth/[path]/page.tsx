import { AuthView } from "@daveyplate/better-auth-ui"
import { authViewPaths } from "@daveyplate/better-auth-ui/server"

export const dynamicParams = false

export function generateStaticParams() {
    return Object.values(authViewPaths).map((path) => ({ path }))
}

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
    const { path } = await params
    
    // Don't redirect to dashboard if on sign-out path
    const redirectPath = path === 'sign-out' ? '/auth/sign-in' : '/dashboard'
    
    return (
        <main className="container flex grow flex-col items-center justify-center self-center p-4 md:p-6">
            <AuthView path={path} redirectTo={redirectPath}/>
        </main>
    )
}