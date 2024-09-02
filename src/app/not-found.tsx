import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-start py-[16px] h-screen text-center gap-[16px]">
            <h1 className="text-4xl font-bold">404</h1>
            <p>The page you are looking for <b>does not exist</b> or you do not have the correct <b>permissions</b> to access it.</p>
            <Link href="/" className='underline font-bold'>
                Go back to Home
            </Link>
        </div>
    )
}